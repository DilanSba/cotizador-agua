import React from 'react';
import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer';
import { CartItem, PaymentMode } from '../types';
import { MODE_LABELS, isCashType, isSynchronyType } from '../constants';

export interface ClientInfo {
  nombre: string;
  apellido: string;
  telefono: string;
  pueblo: string;
}

interface Props {
  items: CartItem[];
  mode: PaymentMode;
  hasSolarBundle: boolean;
  hasROBundle: boolean;
  downPayment: number;
  client: ClientInfo;
  quoteNumber: string;
  date: string;
}

const DARK  = '#1a3a6b';
const BLUE  = '#2563eb';
const LBLUE = '#dbeafe';
const BG    = '#f0f4fa';
const BRDR  = '#cbd5e1';
const TXT   = '#1e293b';
const MUTED = '#64748b';
const WHITE = '#ffffff';
const GREEN = '#16a34a';
const VIO   = '#7c3aed';
const LVIO  = '#ede9fe';

const fmtPDF = (v: number): string =>
  '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const s = StyleSheet.create({
  page:       { backgroundColor: BG, fontFamily: 'Helvetica', fontSize: 9, color: TXT },

  hdr:        { backgroundColor: WHITE, paddingHorizontal: 30, paddingTop: 18, paddingBottom: 12,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                borderBottomWidth: 1, borderBottomColor: LBLUE },
  logo:       { width: 88, height: 40, objectFit: 'contain' },
  firmarPill: { backgroundColor: DARK, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 7 },
  firmarTxt:  { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 11 },

  meta:       { backgroundColor: WHITE, paddingHorizontal: 30, paddingBottom: 12,
                flexDirection: 'row', gap: 20 },
  mRow:       { flexDirection: 'row', gap: 3 },
  mLbl:       { fontFamily: 'Helvetica-Bold', color: BLUE, fontSize: 8.5 },
  mVal:       { color: TXT, fontSize: 8.5 },

  igrid:      { paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row', gap: 10 },
  ibox:       { flex: 1, backgroundColor: WHITE, borderRadius: 6, borderWidth: 1,
                borderColor: BRDR, padding: 10, gap: 5 },
  irow:       { flexDirection: 'row', gap: 4, alignItems: 'flex-start' },
  ilbl:       { fontFamily: 'Helvetica-Bold', color: BLUE, fontSize: 7.5, minWidth: 74 },
  ival:       { color: TXT, fontSize: 7.5, flex: 1 },

  sec:        { paddingHorizontal: 30, paddingBottom: 8 },
  secTitle:   { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: BLUE,
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },

  pgrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pcard:      { width: '48.5%', backgroundColor: WHITE, borderRadius: 6,
                borderWidth: 1, borderColor: BRDR, padding: 8,
                flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  pcardBlue:  { borderColor: BLUE, borderWidth: 1.5, backgroundColor: '#f0f7ff' },
  pcardVio:   { borderColor: VIO,  borderWidth: 1.5, backgroundColor: LVIO },
  pimg:       { width: 36, height: 36, objectFit: 'contain', marginTop: 2 },
  pinfo:      { flex: 1 },
  pname:      { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: TXT, marginBottom: 1.5 },
  pcat:       { fontSize: 6.5, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  pprice:     { fontFamily: 'Helvetica-Bold', fontSize: 12, color: BLUE, marginTop: 3 },
  ppriceVio:  { fontFamily: 'Helvetica-Bold', fontSize: 12, color: VIO, marginTop: 3 },
  pqrow:      { flexDirection: 'row', gap: 4, marginTop: 1.5 },
  pqtxt:      { fontSize: 6.5, color: MUTED },
  pinstxt:    { fontSize: 6.5, color: VIO, fontFamily: 'Helvetica-Bold' },
  pivurow:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 1.5 },
  pivulbl:    { fontSize: 6, color: MUTED },
  pivuval:    { fontSize: 6, color: MUTED, fontFamily: 'Helvetica-Bold' },

  discbar:    { paddingHorizontal: 30, paddingVertical: 5, flexDirection: 'row', gap: 5,
                alignItems: 'center', flexWrap: 'wrap' },
  dlbl:       { fontFamily: 'Helvetica-Bold', fontSize: 8, color: BLUE },
  ditem:      { fontFamily: 'Helvetica-Bold', fontSize: 8, color: GREEN },
  dtotal:     { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#dc2626' },

  tsec:       { paddingHorizontal: 30, paddingBottom: 10 },
  trow:       { flexDirection: 'row', gap: 10 },
  tbox:       { flex: 1, backgroundColor: WHITE, borderRadius: 6, borderWidth: 1,
                borderColor: BRDR, padding: 11,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tboxBlue:   { borderColor: BLUE, borderWidth: 1.5 },
  tboxVio:    { borderColor: VIO, borderWidth: 1.5 },
  tlcol:      { gap: 4 },
  tlbl:       { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: BLUE },
  tlblVio:    { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: VIO },
  tbadge:     { backgroundColor: BLUE, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2.5,
                alignSelf: 'flex-start' },
  tbadgeVio:  { backgroundColor: VIO, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2.5,
                alignSelf: 'flex-start' },
  tbadgetxt:  { color: WHITE, fontSize: 6.5, fontFamily: 'Helvetica-Bold' },
  tval:       { fontFamily: 'Helvetica-Bold', fontSize: 16, color: TXT },
  mnote:      { textAlign: 'center', color: VIO, fontFamily: 'Helvetica-Bold', fontSize: 7, marginTop: 4 },

  spacer:     { flex: 1 },
  footer:     { backgroundColor: DARK, paddingHorizontal: 30, paddingVertical: 16,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fsite:      { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 14 },
  fcol:       { gap: 2.5 },
  fhead:      { color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 8, marginBottom: 1.5 },
  ftext:      { color: '#93c5fd', fontSize: 7.5 },
});

export const QuoteDocument: React.FC<Props> = ({
  items, mode, hasSolarBundle, hasROBundle, downPayment, client, quoteNumber, date,
}) => {
  const isCash  = isCashType(mode);
  const isSynch = isSynchronyType(mode);
  const inst0   = items[0]?.installments ?? 18;
  const roInst  = items.find(i => i.product.id === 'trat-ro')?.installments ?? 18;

  const base = items.reduce((sum, c) => {
    const p = isSynch
      ? (c.installments === 61 ? (c.product.prices.m61 ?? 0) : (c.product.prices.m18 ?? 0))
      : (c.product.prices.cash ?? 0);
    return sum + p * c.quantity;
  }, 0);

  const sdsc  = hasSolarBundle ? (isSynch ? 500 / inst0  : 500)  : 0;
  const rdsc  = hasROBundle    ? (isSynch ? 1000 / roInst : 1000) : 0;
  const dpdsc = isSynch ? downPayment / inst0 : downPayment;
  const total = base - sdsc - rdsc - dpdsc;

  const sinIvu = items.reduce((s, c) => s + (c.product.cashSinIvu ?? 0) * c.quantity, 0);
  let adjSin = sinIvu;
  let adjIvu = items.reduce((s, c) => s + (c.product.ivuCash ?? 0) * c.quantity, 0);
  if (hasSolarBundle && isCash) { adjSin -= 448.43; adjIvu -= 51.57; }
  if (hasROBundle    && isCash) { adjSin -= 896.86; adjIvu -= 103.14; }

  const hasDisc = hasSolarBundle || hasROBundle || downPayment > 0;
  const totalDisc = sdsc + rdsc + dpdsc;

  const LOGO = 'https://i.postimg.cc/6T5J2v2G/Thumbnail.png';

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* HEADER */}
        <View style={s.hdr}>
          <Image src={LOGO} style={s.logo} />
          <View style={s.firmarPill}>
            <Text style={s.firmarTxt}>Firmar Acuerdo</Text>
          </View>
        </View>

        {/* META */}
        <View style={s.meta}>
          <View style={s.mRow}>
            <Text style={s.mLbl}>Cotizacion No. </Text>
            <Text style={s.mVal}>{quoteNumber}</Text>
          </View>
          <View style={s.mRow}>
            <Text style={s.mLbl}>Fecha </Text>
            <Text style={s.mVal}>{date}</Text>
          </View>
        </View>

        {/* INFO GRID */}
        <View style={s.igrid}>
          <View style={s.ibox}>
            {([
              ['Consultor:', 'Dilan Buitrago'],
              ['Telefono:', '(787) 395-7766'],
              ['Correo:', 'd.buitrago@windmarhome.com'],
              ['Metodo Pago:', MODE_LABELS[mode]],
            ] as [string, string][]).map(([lbl, val]) => (
              <View key={lbl} style={s.irow}>
                <Text style={s.ilbl}>{lbl}</Text>
                <Text style={s.ival}>{val}</Text>
              </View>
            ))}
          </View>
          <View style={s.ibox}>
            {([
              ['Nombre:', client.nombre],
              ['Apellido:', client.apellido],
              ['Telefono:', client.telefono],
              ['Pueblo:', client.pueblo],
            ] as [string, string][]).map(([lbl, val]) => (
              <View key={lbl} style={s.irow}>
                <Text style={s.ilbl}>{lbl}</Text>
                <Text style={s.ival}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PRODUCTS */}
        <View style={s.sec}>
          <Text style={s.secTitle}>Productos Cotizados</Text>
          <View style={s.pgrid}>
            {items.map(item => {
              const price = isSynch
                ? (item.installments === 61 ? (item.product.prices.m61 ?? 0) : (item.product.prices.m18 ?? 0))
                : (item.product.prices.cash ?? 0);
              return (
                <View key={item.product.id} style={[s.pcard, isSynch ? s.pcardVio : s.pcardBlue]}>
                  <Image src={item.product.imageUrl} style={s.pimg} />
                  <View style={s.pinfo}>
                    <Text style={s.pname}>{item.product.name}</Text>
                    <Text style={s.pcat}>{item.product.category}</Text>
                    <Text style={isSynch ? s.ppriceVio : s.pprice}>
                      {fmtPDF(price * item.quantity)}
                    </Text>
                    <View style={s.pqrow}>
                      <Text style={s.pqtxt}>Cant: {item.quantity}</Text>
                      {isSynch && (
                        <Text style={s.pinstxt}> · {item.installments}m</Text>
                      )}
                    </View>
                    {isCash && (item.product.cashSinIvu != null) && (
                      <>
                        <View style={s.pivurow}>
                          <Text style={s.pivulbl}>Sin IVU:</Text>
                          <Text style={s.pivuval}>{fmtPDF((item.product.cashSinIvu ?? 0) * item.quantity)}</Text>
                        </View>
                        <View style={s.pivurow}>
                          <Text style={s.pivulbl}>IVU (11.5%):</Text>
                          <Text style={s.pivuval}>{fmtPDF((item.product.ivuCash ?? 0) * item.quantity)}</Text>
                        </View>
                      </>
                    )}
                    {isSynch && (item.product.synchronySinIvu != null) && (
                      <View style={s.pivurow}>
                        <Text style={s.pivulbl}>Total financiado:</Text>
                        <Text style={s.pivuval}>{fmtPDF(item.product.prices.synchrony ?? 0)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* DISCOUNTS */}
        {hasDisc && (
          <View style={s.discbar}>
            <Text style={s.dlbl}>Descuentos:</Text>
            {hasSolarBundle && <Text style={s.ditem}> Firma y Gana -$500.00 </Text>}
            {hasROBundle    && <Text style={s.ditem}> Bundle RO -$1,000.00 </Text>}
            {downPayment > 0 && <Text style={s.ditem}> Down Payment -{fmtPDF(downPayment)} </Text>}
            <Text style={s.dtotal}>= -{fmtPDF(totalDisc)}</Text>
          </View>
        )}

        {/* TOTALS */}
        <View style={s.tsec}>
          <View style={s.trow}>
            {isCash && sinIvu > 0 && (
              <View style={s.tbox}>
                <View style={s.tlcol}>
                  <Text style={s.tlbl}>{'Subtotal\nsin IVU'}</Text>
                </View>
                <Text style={s.tval}>{fmtPDF(adjSin)}</Text>
              </View>
            )}
            <View style={[s.tbox, isSynch ? s.tboxVio : s.tboxBlue]}>
              <View style={s.tlcol}>
                {isCash && sinIvu > 0 && (
                  <View style={s.tbadge}>
                    <Text style={s.tbadgetxt}>IVU del 11.5%</Text>
                  </View>
                )}
                {isSynch && (
                  <View style={s.tbadgeVio}>
                    <Text style={s.tbadgetxt}>{inst0} meses</Text>
                  </View>
                )}
                <Text style={isSynch ? s.tlblVio : s.tlbl}>
                  {isSynch ? 'Mensualidad\nEstimada' : 'Costo total\ncon IVU'}
                </Text>
              </View>
              <Text style={s.tval}>{fmtPDF(total)}</Text>
            </View>
          </View>
          {isSynch && (
            <Text style={s.mnote}>*Sujeto a aprobacion de credito</Text>
          )}
        </View>

        <View style={s.spacer} />

        {/* FOOTER */}
        <View style={s.footer}>
          <Text style={s.fsite}>windmar.com</Text>
          <View style={s.fcol}>
            <Text style={s.fhead}>Contactanos</Text>
            <Text style={s.ftext}>ventas@windmarhome.com</Text>
            <Text style={s.ftext}>(787) 395-7766</Text>
          </View>
          <View style={s.fcol}>
            <Text style={s.fhead}>Direccion</Text>
            <Text style={s.ftext}>1255 Avenida F.D. Roosevelt,</Text>
            <Text style={s.ftext}>San Juan, 00920, Puerto Rico.</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
