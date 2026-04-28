import React from 'react';
import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer';
import { CartItem, PaymentMode, ConsultorInfo, ClienteInfo } from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Represents one price column in the table
export interface EffectiveCol {
  key: string;
  label: string;
  shortLabel: string;
  isMonthly: boolean;
  installments?: 18 | 61;
  color: string;
  lightBg: string;
  getPrice: (item: CartItem) => number | null;
}

export function buildEffectiveCols(
  selectedModes: PaymentMode[],
  installmentsSync: (18 | 61)[],
  _installmentsKiwi: (18 | 61)[],
): EffectiveCol[] {
  const cols: EffectiveCol[] = [];

  if (selectedModes.includes('cash')) {
    cols.push({
      key: 'cash', label: 'Cash', shortLabel: 'CASH', isMonthly: false,
      color: '#2563eb', lightBg: '#eff6ff',
      getPrice: (item) => item.product.prices.cash,
    });
  }

  if (selectedModes.includes('oriental')) {
    cols.push({
      key: 'oriental', label: 'Oriental', shortLabel: 'ORIENTAL', isMonthly: false,
      color: '#059669', lightBg: '#ecfdf5',
      getPrice: (item) => item.product.prices.cash,
    });
  }

  if (selectedModes.includes('synchrony')) {
    const insts = installmentsSync.length > 0 ? installmentsSync : [18];
    const sorted = [...insts].sort((a, b) => a - b);
    sorted.forEach(inst => {
      cols.push({
        key: `sync_${inst}`, label: `Synchrony ${inst}m`, shortLabel: `SYNC ${inst}m`,
        isMonthly: true, installments: inst,
        color: '#7c3aed', lightBg: '#f5f3ff',
        getPrice: (item) => inst === 61 ? item.product.prices.m61 : item.product.prices.m18,
      });
    });
  }

  if (selectedModes.includes('kiwi')) {
    cols.push({
      key: 'kiwi', label: 'Kiwi', shortLabel: 'KIWI',
      isMonthly: false,
      color: '#d97706', lightBg: '#fffbeb',
      getPrice: (item) => item.product.prices.synchrony,
    });
  }

  return cols;
}

// ── theme ─────────────────────────────────────────────────────────────────────

const DARK  = '#0f2044';
const BLUE  = '#2563eb';
const LBLUE = '#dbeafe';
const BG    = '#f0f4fa';
const BRDR  = '#e2e8f0';
const TXT   = '#1e293b';
const MUTED = '#64748b';
const WHITE = '#ffffff';
const DARK2 = '#1e3a5f';

// ── styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: { backgroundColor: BG, fontFamily: 'Helvetica', fontSize: 9, color: TXT },

  // Header
  hdr: {
    backgroundColor: DARK, paddingHorizontal: 30, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { width: 90, height: 38, objectFit: 'contain' },
  hdrRight: { flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  hdrTitle: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 13, letterSpacing: 1 },
  hdrSub: { color: '#93c5fd', fontSize: 7.5, letterSpacing: 0.5 },

  // Quote meta bar
  metaBar: {
    backgroundColor: WHITE, paddingHorizontal: 30, paddingVertical: 8,
    flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: LBLUE,
  },
  metaItem: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  metaLbl: { fontFamily: 'Helvetica-Bold', color: BLUE, fontSize: 7.5 },
  metaVal: { color: TXT, fontSize: 7.5 },

  // Info cards
  infoGrid: {
    paddingHorizontal: 30, paddingVertical: 10,
    flexDirection: 'row', gap: 10,
  },
  infoCard: {
    flex: 1, backgroundColor: WHITE, borderRadius: 6,
    borderWidth: 1, borderColor: BRDR, padding: 10, gap: 4,
  },
  infoCardTitle: {
    fontFamily: 'Helvetica-Bold', fontSize: 7, color: BLUE,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3,
    borderBottomWidth: 0.5, borderBottomColor: LBLUE, paddingBottom: 3,
  },
  infoRow: { flexDirection: 'row', gap: 4, alignItems: 'flex-start' },
  infoLbl: { fontFamily: 'Helvetica-Bold', color: MUTED, fontSize: 7.5, minWidth: 60 },
  infoVal: { color: TXT, fontSize: 7.5, flex: 1 },

  // Section title
  secWrap: { paddingHorizontal: 30, paddingBottom: 6 },
  secTitle: {
    fontFamily: 'Helvetica-Bold', fontSize: 7, color: BLUE,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6,
  },

  // Products table
  table: { marginHorizontal: 30, marginBottom: 10, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: BRDR },
  tableHead: { backgroundColor: DARK2, flexDirection: 'row' },
  tableHeadProductCell: { padding: 7, flex: 3 },
  tableHeadCell: { padding: 7, flex: 1, borderLeftWidth: 0.5, borderLeftColor: '#ffffff30' },
  tableHeadTxt: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableHeadTxtCenter: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  tableRow: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: BRDR },
  tableRowEven: { backgroundColor: '#f8fafc' },
  tableRowOdd: { backgroundColor: WHITE },

  productCell: { flex: 3, padding: 7, flexDirection: 'row', gap: 6, alignItems: 'center' },
  productImg: { width: 28, height: 28, objectFit: 'contain' },
  productName: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: TXT },
  productCat: { fontSize: 6, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.3 },
  productQty: { fontSize: 6.5, color: MUTED, marginTop: 1 },

  priceCell: { flex: 1, padding: 7, borderLeftWidth: 0.5, borderLeftColor: BRDR, justifyContent: 'center', alignItems: 'center' },
  priceMain: { fontFamily: 'Helvetica-Bold', fontSize: 9, textAlign: 'center' },
  priceSub: { fontSize: 6, color: MUTED, textAlign: 'center', marginTop: 1 },

  // Discount bar
  discBar: {
    marginHorizontal: 30, marginBottom: 8,
    backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#86efac',
    borderRadius: 6, padding: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 5, alignItems: 'center',
  },
  discLbl: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#15803d' },
  discItem: { fontSize: 7.5, color: '#15803d', fontFamily: 'Helvetica-Bold' },

  // Totals
  totalsWrap: { paddingHorizontal: 30, paddingBottom: 10 },
  totalsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  totalCard: {
    flex: 1, minWidth: 100, backgroundColor: WHITE,
    borderRadius: 6, borderWidth: 1, borderColor: BRDR,
    padding: 10, alignItems: 'center', gap: 3,
  },
  totalBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 2 },
  totalBadgeTxt: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalAmount: { fontFamily: 'Helvetica-Bold', fontSize: 15, color: TXT },
  totalLabel: { fontSize: 6.5, color: MUTED, textAlign: 'center' },
  totalNote: { fontSize: 6, color: MUTED, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 1 },

  spacer: { flex: 1 },
  notice: {
    marginHorizontal: 30, marginBottom: 6,
    backgroundColor: '#fefce8', borderWidth: 0.5, borderColor: '#fde047',
    borderRadius: 5, padding: 7,
  },
  noticeTxt: { fontSize: 6.5, color: '#713f12', textAlign: 'center', fontFamily: 'Helvetica-Bold' },

  footer: {
    backgroundColor: DARK, paddingHorizontal: 30, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  fSite: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 13 },
  fCol: { gap: 2.5 },
  fHead: { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 7.5, marginBottom: 1 },
  fText: { color: '#93c5fd', fontSize: 7 },
});

// ── component ─────────────────────────────────────────────────────────────────

export interface QuoteDocumentProps {
  items: CartItem[];
  hasSolarBundle: boolean;
  hasROBundle: boolean;
  downPayment: number;
  consultor: ConsultorInfo;
  cliente: ClienteInfo;
  quoteNumber: string;
  date: string;
  effectiveCols: EffectiveCol[];
}

const LOGO = 'https://i.postimg.cc/6T5J2v2G/Thumbnail.png';

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
  items, hasSolarBundle, hasROBundle, downPayment,
  consultor, cliente, quoteNumber, date, effectiveCols,
}) => {
  const hasDisc = hasSolarBundle || hasROBundle || downPayment > 0;

  const getColTotal = (col: EffectiveCol): number => {
    const sub = items.reduce((s, item) => {
      const p = col.getPrice(item);
      return s + (p ?? 0) * item.quantity;
    }, 0);

    const sdsc = hasSolarBundle ? (col.isMonthly ? 500 / (col.installments ?? 18) : 500) : 0;
    const rdsc = hasROBundle    ? (col.isMonthly ? 1000 / (items.find(i => i.product.id === 'trat-ro')?.installments ?? 18) : 1000) : 0;
    const dpdsc = col.isMonthly ? downPayment / (col.installments ?? 18) : downPayment;

    return sub - sdsc - rdsc - dpdsc;
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* HEADER */}
        <View style={s.hdr}>
          <Image src={LOGO} style={s.logo} />
          <View style={s.hdrRight}>
            <Text style={s.hdrTitle}>COTIZACIÓN FORMAL</Text>
            <Text style={s.hdrSub}>SISTEMAS DE AGUA · WINDMAR HOME</Text>
          </View>
        </View>

        {/* META BAR */}
        <View style={s.metaBar}>
          <View style={s.metaItem}>
            <Text style={s.metaLbl}>No. </Text>
            <Text style={s.metaVal}>{quoteNumber}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLbl}>Fecha: </Text>
            <Text style={s.metaVal}>{date}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLbl}>Vigencia: </Text>
            <Text style={s.metaVal}>30 días</Text>
          </View>
        </View>

        {/* INFO CARDS */}
        <View style={s.infoGrid}>
          {/* Consultor */}
          <View style={s.infoCard}>
            <Text style={s.infoCardTitle}>Consultor</Text>
            {([
              ['Nombre:', consultor.nombre || '—'],
              ['Correo:', consultor.correo || '—'],
              ['Teléfono:', consultor.telefono || '—'],
            ] as [string, string][]).map(([l, v]) => (
              <View key={l} style={s.infoRow}>
                <Text style={s.infoLbl}>{l}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Cliente */}
          <View style={s.infoCard}>
            <Text style={s.infoCardTitle}>Cliente</Text>
            {([
              ['Nombre:', cliente.nombre || '—'],
              ['Correo:', cliente.correo || '—'],
              ['Teléfono:', cliente.telefono || '—'],
              ['Dirección:', cliente.direccion || '—'],
            ] as [string, string][]).map(([l, v]) => (
              <View key={l} style={s.infoRow}>
                <Text style={s.infoLbl}>{l}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PRODUCTS TABLE */}
        <View style={s.secWrap}>
          <Text style={s.secTitle}>Productos Cotizados</Text>
        </View>

        <View style={s.table}>
          {/* Table header */}
          <View style={s.tableHead}>
            <View style={s.tableHeadProductCell}>
              <Text style={s.tableHeadTxt}>Producto</Text>
            </View>
            {effectiveCols.map(col => (
              <View key={col.key} style={s.tableHeadCell}>
                <Text style={s.tableHeadTxtCenter}>{col.shortLabel}</Text>
              </View>
            ))}
          </View>

          {/* Table rows */}
          {items.map((item, idx) => (
            <View key={item.product.id} style={[s.tableRow, idx % 2 === 0 ? s.tableRowEven : s.tableRowOdd]}>
              <View style={s.productCell}>
                <Image src={item.product.imageUrl} style={s.productImg} />
                <View>
                  <Text style={s.productName}>{item.product.name}</Text>
                  <Text style={s.productCat}>{item.product.category}</Text>
                  <Text style={s.productQty}>Cant: {item.quantity}</Text>
                </View>
              </View>
              {effectiveCols.map(col => {
                const price = col.getPrice(item);
                const lineTotal = price != null ? price * item.quantity : null;
                return (
                  <View key={col.key} style={s.priceCell}>
                    {lineTotal != null ? (
                      <>
                        <Text style={[s.priceMain, { color: col.color }]}>{fmt(lineTotal)}</Text>
                        {col.isMonthly && (
                          <Text style={s.priceSub}>{col.installments}m c/u</Text>
                        )}
                        {!col.isMonthly && item.product.cashSinIvu != null && (
                          <Text style={s.priceSub}>+IVU 11.5%</Text>
                        )}
                      </>
                    ) : (
                      <Text style={[s.priceSub, { color: '#94a3b8' }]}>N/D</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* DISCOUNT BAR */}
        {hasDisc && (
          <View style={s.discBar}>
            <Text style={s.discLbl}>Descuentos aplicados:</Text>
            {hasSolarBundle && <Text style={s.discItem}> ☀️ Firma y Gana -$500 </Text>}
            {hasROBundle    && <Text style={s.discItem}> 💧 Bundle RO -$1,000 </Text>}
            {downPayment > 0 && <Text style={s.discItem}> 💰 Down Payment -{fmt(downPayment)} </Text>}
          </View>
        )}

        {/* TOTALS */}
        <View style={s.totalsWrap}>
          <Text style={[s.secTitle, { marginBottom: 8 }]}>Resumen de Totales</Text>
          <View style={s.totalsRow}>
            {effectiveCols.map(col => {
              const total = getColTotal(col);
              return (
                <View key={col.key} style={[s.totalCard, { borderColor: col.color + '40', borderTopWidth: 3, borderTopColor: col.color }]}>
                  <View style={[s.totalBadge, { backgroundColor: col.color }]}>
                    <Text style={s.totalBadgeTxt}>{col.shortLabel}</Text>
                  </View>
                  <Text style={[s.totalAmount, { color: col.color }]}>{fmt(total)}</Text>
                  <Text style={s.totalLabel}>
                    {col.isMonthly ? 'Mensualidad estimada' : 'Total con IVU'}
                  </Text>
                  {col.isMonthly && (
                    <Text style={s.totalNote}>*Sujeto a aprobación de crédito</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={s.spacer} />

        {/* NOTICE */}
        <View style={s.notice}>
          <Text style={s.noticeTxt}>
            Los precios incluyen IVU del 11.5%. Cotización válida por 30 días a partir de la fecha de emisión. Precios sujetos a cambio sin previo aviso.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <Text style={s.fSite}>windmar.com</Text>
          <View style={s.fCol}>
            <Text style={s.fHead}>Contáctanos</Text>
            <Text style={s.fText}>ventas@windmarhome.com</Text>
            <Text style={s.fText}>(787) 395-7766</Text>
          </View>
          <View style={s.fCol}>
            <Text style={s.fHead}>Dirección</Text>
            <Text style={s.fText}>1255 Avenida F.D. Roosevelt,</Text>
            <Text style={s.fText}>San Juan, 00920, Puerto Rico.</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
