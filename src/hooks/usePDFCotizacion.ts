import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import React from 'react';
import { CartItem, CotizacionFormData } from '../types';
import { QuoteDocument, buildEffectiveCols, QuoteDocumentProps } from '../components/QuoteDocument';

// Maps product id → public PDF filename
const PRODUCT_PDF_MAP: Record<string, string> = {
  'trat-ro':     'Reverse Osmosis.pdf',
  'trat-poe':    'Suavizador POE.pdf',
  'cal-80-1p':   '80GL 1p.pdf',
  'cal-80-2p':   '80GL 2p.pdf',
  'cal-120-3p':  '80GL 3p.pdf',
  'cal-120-4p':  '80GL 4p.pdf',
  'cis-eco-500': 'Eco 500 Gl.pdf',
  'cis-herc-600':'Herc 600 Gl.pdf',
  'cis-eco-150': 'Eco 150 Gl.pdf',
};

async function fetchPDFBytes(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

export async function downloadCotizacionPDF(
  items: CartItem[],
  formData: CotizacionFormData,
  hasSolarBundle: boolean,
  hasROBundle: boolean,
  downPayment: number,
): Promise<void> {
  const { consultor, cliente, selectedModes, installmentsSync, installmentsKiwi } = formData;

  const quoteNumber = `WW-${Date.now().toString(36).toUpperCase()}`;
  const date = new Date().toLocaleDateString('es-PR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const effectiveCols = buildEffectiveCols(selectedModes, installmentsSync, installmentsKiwi);

  // 1. Generate the formal quotation page via @react-pdf/renderer
  const docProps: QuoteDocumentProps = {
    items, hasSolarBundle, hasROBundle, downPayment,
    consultor, cliente, quoteNumber, date, effectiveCols,
  };

  const quoteElement = React.createElement(QuoteDocument, docProps);
  const quoteBlob = await pdf(quoteElement).toBlob();
  const quoteBytes = new Uint8Array(await quoteBlob.arrayBuffer());

  // 2. Load and merge product brochure PDFs
  const mergedDoc = await PDFDocument.create();

  // Insert the quotation page first
  const quotePdf = await PDFDocument.load(quoteBytes);
  const quotePages = await mergedDoc.copyPages(quotePdf, quotePdf.getPageIndices());
  quotePages.forEach(p => mergedDoc.addPage(p));

  // Collect unique product PDF URLs (preserve cart order, deduplicate)
  const seen = new Set<string>();
  for (const item of items) {
    const filename = PRODUCT_PDF_MAP[item.product.id];
    if (!filename || seen.has(filename)) continue;
    seen.add(filename);

    const url = `/${encodeURIComponent(filename)}`;
    const bytes = await fetchPDFBytes(url);
    if (!bytes) continue;

    try {
      const productPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await mergedDoc.copyPages(productPdf, productPdf.getPageIndices());
      pages.forEach(p => mergedDoc.addPage(p));
    } catch {
      // Skip unreadable product PDF silently
    }
  }

  // 3. Trigger download
  const finalBytes = await mergedDoc.save();
  const blob = new Blob([finalBytes], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `Cotizacion-Water-${quoteNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}
