import React from 'react';
import { CartItem, PaymentMode } from '../types';
import { MODE_LABELS, isCashType, isSynchronyType } from '../constants';
import { ShoppingBag, Trash2, Copy, MessageCircle, Info, Minus, Plus, Sun, Droplets, CheckCircle2 } from 'lucide-react';

interface CartProps {
  items: CartItem[]; mode: PaymentMode; hasSolarBundle: boolean; hasROBundle: boolean; downPayment: number;
  onToggleSolarBundle: () => void; onToggleROBundle: () => void; onUpdateDownPayment: (val: number) => void;
  onUpdateQty: (id: string, delta: number) => void; onUpdateInstallments: (id: string, installments: 18 | 61) => void;
  onRemoveItem: (id: string) => void; onClear: () => void; onCopy: () => void; onWhatsApp: () => void;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const Cart: React.FC<CartProps> = ({
  items, mode, hasSolarBundle, hasROBundle, downPayment,
  onToggleSolarBundle, onToggleROBundle, onUpdateDownPayment,
  onUpdateQty, onUpdateInstallments, onRemoveItem, onClear, onCopy, onWhatsApp,
}) => {
  const [isOver, setIsOver] = React.useState(false);
  const isCash  = isCashType(mode);
  const isSynch = isSynchronyType(mode);
  const totalCount = items.reduce((s, c) => s + c.quantity, 0);
  const roItem = items.find(i => i.product.id === 'trat-ro');
  const installmentsFirst = items[0]?.installments ?? 18;
  const installmentsForRO = roItem?.installments ?? 18;
  const baseTotalRaw = items.reduce((s, c) => {
    const price = isSynch ? (c.installments === 18 ? (c.product.prices.m18 ?? 0) : (c.product.prices.m61 ?? 0)) : (c.product.prices.cash ?? 0);
    return s + price * c.quantity;
  }, 0);
  const solarDiscountFlat = hasSolarBundle ? 500 : 0;
  const roDiscountFlat    = hasROBundle ? 1000 : 0;
  const totalSolarDiscount = isSynch ? solarDiscountFlat / installmentsFirst : solarDiscountFlat;
  const totalRODiscount    = isSynch ? roDiscountFlat / installmentsForRO : roDiscountFlat;
  const totalDownPayment   = isSynch ? downPayment / installmentsFirst : downPayment;
  const total = baseTotalRaw - totalSolarDiscount - totalRODiscount - totalDownPayment;
  const accentBg     = isSynch ? 'bg-violet-600'   : 'bg-blue-600';
  const accentBorder = isSynch ? 'border-violet-400' : 'border-blue-400';
  const accentTint   = isSynch ? 'bg-violet-50'    : 'bg-blue-50';
  const accentText   = isSynch ? 'text-violet-700'  : 'text-blue-700';
  const accentBold   = isSynch ? 'text-violet-800'  : 'text-blue-800';
  const accentMuted  = isSynch ? 'text-violet-500'  : 'text-blue-500';
  const accentPanelBorder = isSynch ? 'border-violet-100' : 'border-blue-100';
  const renderTotals = () => {
    const nodes: React.ReactNode[] = [];
    if (isCash) {
      const sinIvu = items.reduce((s, c) => s + (c.product.cashSinIvu ?? 0) * c.quantity, 0);
      const ivu    = items.reduce((s, c) => s + (c.product.ivuCash ?? 0) * c.quantity, 0);
      let finalSinIvu = sinIvu; let finalIvu = ivu;
      if (hasSolarBundle) { finalSinIvu -= 448.43; finalIvu -= 51.57; }
      if (hasROBundle)    { finalSinIvu -= 896.86; finalIvu -= 103.14; }
      if (downPayment > 0) { finalSinIvu -= downPayment / 1.115; finalIvu -= downPayment - downPayment / 1.115; }
      if (sinIvu > 0) {
        nodes.push(<div key="cash-ivu" className="bg-blue-50 rounded-xl p-4 mb-4 flex flex-col gap-2 border border-blue-100 shadow-sm">
            {hasSolarBundle && (<div className="flex justify-between items-center text-emerald-600 mb-1 pb-1 border-b border-emerald-100"><span className="text-[10px] font-bold uppercase tracking-wider">Desc. Solar Bundle</span><span className="font-mono text-sm font-bold">-$500.00</span></div>)}
            {hasROBundle && (<div className="flex justify-between items-center text-emerald-600 mb-1 pb-1 border-b border-emerald-100"><span className="text-[10px] font-bold uppercase tracking-wider">Desc. Bundle RO</span><span className="font-mono text-sm font-bold">-$1,000.00</span></div>)}
            <div className="flex justify-between items-center text-blue-700"><span className="text-[11px] font-bold uppercase tracking-wider">Total Sin IVU</span><span className="font-mono text-lg font-bold">{fmt.format(finalSinIvu)}</span></div>
            <div className="flex justify-between items-center text-blue-800"><span className="text-[11px] font-bold uppercase tracking-wider">IVU (11.5%)</span><span className="font-mono text-lg font-bold">{fmt.format(finalIvu)}</span></div>
          </div>);
      }
    }
    if (isSynch) {
      const totalFinanciado = items.reduce((s, c) => s + (c.product.prices.synchrony ?? 0) * c.quantity, 0);
      let finalFinanciado = totalFinanciado;
      if (hasSolarBundle) finalFinanciado -= 500;
      if (hasROBundle)    finalFinanciado -= 1000;
      if (downPayment > 0) finalFinanciado -= downPayment;
      nodes.push(<div key="synch-totals" className="bg-violet-600 rounded-xl p-4 mb-4 flex flex-col gap-2 shadow-md shadow-violet-600/20">
          {hasSolarBundle && (<div className="flex justify-between items-center text-violet-200 mb-1 pb-1 border-b border-violet-500/50"><span className="text-[10px] font-bold uppercase tracking-wider">Desc. Solar Bundle</span><span className="font-mono text-sm font-bold">-$500.00</span></div>)}
          {hasROBundle && (<div className="flex justify-between items-center text-violet-200 mb-1 pb-1 border-b border-violet-500/50"><span className="text-[10px] font-bold uppercase tracking-wider">Desc. Bundle RO</span><span className="font-mono text-sm font-bold">-$1,000.00</span></div>)}
          <div className="flex justify-between items-center text-white"><span className="text-[11px] font-bold uppercase tracking-wider">Monto Total a Financiar</span><span className="font-mono text-xl font-black">{fmt.format(finalFinanciado)}</span></div>
          <div className="text-[9px] text-violet-200 font-bold uppercase tracking-widest text-right">Sujeto a aprobación de crédito</div>
        </div>);
    }
    nodes.push(<div key="main-total" className="flex justify-between items-center mt-3 pt-4 border-t-2 border-blue-100">
        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Total a Pagar</span>
        <div className="flex flex-col items-end">
          <span className={`font-mono text-2xl font-black drop-shadow-sm ${isSynch ? 'text-violet-600' : 'text-blue-600'}`}>{fmt.format(total)}</span>
          {isSynch && <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mt-0.5">Mensualidad Estimada</span>}
        </div>
      </div>);
    return nodes;
  };
  const PromoCard = ({ active, onToggle, icon: Icon, title, subtitle, discountFlat, installmentsUsed, colorKey }: {
    active: boolean; onToggle: () => void; icon: React.ElementType; title: string; subtitle: string;
    discountFlat: number; installmentsUsed: number; colorKey: 'solar' | 'ro';
  }) => {
    const discountPerMonth = discountFlat / installmentsUsed;
    const inactiveIconBg = colorKey === 'solar' ? 'bg-amber-50 text-amber-400' : 'bg-cyan-50 text-cyan-400';
    const activeIconBg   = isSynch ? 'bg-violet-600 text-white' : 'bg-blue-600 text-white';
    const activeBg = isSynch ? 'bg-violet-50 border-violet-300' : 'bg-blue-50 border-blue-300';
    const inactiveBg = 'bg-white border-slate-100 hover:border-slate-200';
    const activeTitleColor  = isSynch ? 'text-violet-800' : 'text-blue-800';
    const activeAmountColor = isSynch ? 'text-violet-600' : 'text-blue-600';
    return (
      <button onClick={onToggle} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left shadow-sm ${active ? activeBg : inactiveBg}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${active ? activeIconBg : inactiveIconBg}`}><Icon className="w-4 h-4" /></div>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-black leading-tight transition-colors ${active ? activeTitleColor : 'text-slate-700'}`}>{title}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{subtitle}</div>
          {active && isSynch && (<div className={`text-[10px] font-bold mt-1 ${activeAmountColor}`}>{fmt.format(discountPerMonth)}/mes · Total {fmt.format(discountFlat)}</div>)}
        </div>
        <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
          <div className={`font-mono text-[14px] font-black transition-colors ${active ? activeAmountColor : 'text-slate-300'}`}>
            {isSynch && active ? `-${fmt.format(discountPerMonth)}` : `-${fmt.format(discountFlat)}`}
          </div>
          {isSynch && active ? <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">por mes</span> : <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">descuento</span>}
          {active && <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 ${isSynch ? 'text-violet-500' : 'text-blue-500'}`} />}
        </div>
      </button>
    );
  };
  return (
    <div onDragOver={(e) => { e.preventDefault(); setIsOver(true); }} onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); const productId = e.dataTransfer.getData('productId'); if (productId) window.dispatchEvent(new CustomEvent('productDropped', { detail: { productId } })); }}
      className={`bg-white border-2 rounded-[22px] shadow-xl flex flex-col sticky top-6 transition-all duration-300 ${isOver ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-blue-600/20' : 'border-slate-200 shadow-sm'}`}
    >
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-bold text-slate-900 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> Cotización</div>
          <span className={`text-white text-[11px] font-bold px-2 py-0.5 rounded-full ${isSynch ? 'bg-violet-600' : 'bg-blue-600'}`}>{totalCount}</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest">Modo: {MODE_LABELS[mode]}</div>
      </div>
      <div className="p-4 flex flex-col gap-3.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-12 px-5 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-slate-400" /></div>
            <div className="text-[13px] text-slate-400">Tu cotización está vacía.<br />Agrega productos para comenzar.</div>
          </div>
        ) : items.map(item => {
          const price = isSynch ? (item.installments === 61 ? (item.product.prices.m61 ?? 0) : (item.product.prices.m18 ?? 0)) : (item.product.prices.cash ?? 0);
          const isRO = item.product.id === 'trat-ro';
          const roActive = isRO && hasROBundle;
          return (
            <div key={item.product.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-xl border border-slate-100 p-2 overflow-hidden shadow-sm">
                  <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-[16px] font-black text-slate-900 leading-tight mb-1">{item.product.name}</div>
                  <div className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">{item.product.category}</div>
                  {roActive && <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tighter">Bundle RO: -$1,000.00</div>}
                </div>
                <button onClick={() => onRemoveItem(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 mt-1"><Trash2 className="w-5 h-5" /></button>
              </div>
              {isSynch && (
                <div className="flex bg-white border border-slate-200 p-1 rounded-xl mb-3">
                  <button onClick={() => onUpdateInstallments(item.product.id, 18)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${item.installments === 18 ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'text-slate-500 hover:bg-slate-50'}`}>18 Meses</button>
                  <button onClick={() => onUpdateInstallments(item.product.id, 61)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${item.installments === 61 ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'text-slate-500 hover:bg-slate-50'}`}>61 Meses</button>
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button onClick={() => onUpdateQty(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors text-slate-600 font-bold"><Minus className="w-4 h-4" /></button>
                  <span className="text-[15px] font-mono font-black w-7 text-center text-slate-900">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors text-slate-600 font-bold"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-[19px] font-black ${isSynch ? 'text-violet-700' : 'text-blue-700'}`}>{fmt.format(price * item.quantity)}</div>
                  {isSynch && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">por mes</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-5 pt-4 border-t border-slate-100">
        <div className="mb-3.5">{renderTotals()}</div>
        <div className="grid grid-cols-2 gap-2">
          <button disabled={items.length === 0} onClick={onClear} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[12px] hover:bg-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"><Trash2 className="w-3.5 h-3.5" /> Vaciar</button>
          <button disabled={items.length === 0} onClick={onCopy} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-white font-bold text-[12px] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg ${isSynch ? 'bg-violet-600 shadow-violet-600/20 hover:bg-violet-700' : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700'}`}><Copy className="w-3.5 h-3.5" /> Copiar</button>
          <button disabled={items.length === 0} onClick={onWhatsApp} className="col-span-2 flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#25D366] text-white font-bold text-[12px] shadow-lg shadow-emerald-500/20 hover:bg-[#1ebe5a] transition-all disabled:opacity-40 disabled:pointer-events-none"><MessageCircle className="w-4 h-4" /> Enviar por WhatsApp</button>
        </div>
        {items.length > 0 && (
          <div className="mt-4 flex flex-col gap-2.5">
            <div className="bg-white border-2 border-slate-100 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Pronto (Down Payment)</div>
                <div className={`font-mono text-[13px] font-black ${isSynch ? 'text-violet-600' : 'text-blue-600'}`}>{fmt.format(downPayment)}</div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input type="number" value={downPayment || ''} onChange={(e) => onUpdateDownPayment(Number(e.target.value))} placeholder="0.00" className="w-full pl-7 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 py-1"><div className="flex-1 h-px bg-slate-100" /><span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Promociones</span><div className="flex-1 h-px bg-slate-100" /></div>
            <PromoCard active={hasSolarBundle} onToggle={onToggleSolarBundle} icon={Sun} title="Solar + Agua — Firma y Gana" subtitle="¿Compras un sistema solar junto a tu solución de agua?" discountFlat={500} installmentsUsed={installmentsFirst} colorKey="solar" />
            <PromoCard active={hasROBundle} onToggle={onToggleROBundle} icon={Droplets} title="Bundle Reverse Osmosis" subtitle="¿Compras un RO junto a otro producto WindMar Home?" discountFlat={1000} installmentsUsed={installmentsForRO} colorKey="ro" />
          </div>
        )}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2.5 items-start">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-500 leading-relaxed">Precios referenciales. Planes de financiamiento sujetos a aprobación de crédito. <strong>Firma: Dilan Buitrago</strong></div>
        </div>
      </div>
    </div>
  );
};
