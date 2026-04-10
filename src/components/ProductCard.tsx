import React from 'react';
import { Product, PaymentMode } from '../types';
import { MODE_LABELS, isCashType, isSynchronyType } from '../constants';
import { Users, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  mode: PaymentMode;
  onAddToCart: (product: Product, installments?: 18 | 61) => void;
  isInCart: boolean;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const ProductCard: React.FC<ProductCardProps> = ({ product, mode, onAddToCart, isInCart }) => {
  const [selectedInstallments, setSelectedInstallments] = React.useState<18 | 61>(18);

  const isCash  = isCashType(mode);
  const isSynch = isSynchronyType(mode);

  // Precio principal a mostrar
  const price: number | null = isCash
    ? product.prices.cash
    : (selectedInstallments === 61 ? product.prices.m61 : product.prices.m18);

  const isUnavailable = price === null;

  // Colores según modo
  const accentColor  = isSynch ? 'text-violet-600'   : 'text-blue-600';
  const panelBg      = isSynch ? 'bg-violet-50'      : 'bg-blue-50';
  const panelBorder  = isSynch ? 'border-violet-100' : 'border-blue-100';
  const panelText    = isSynch ? 'text-violet-700'   : 'text-blue-700';
  const toggleActive = isSynch ? 'bg-violet-600 text-white shadow-violet-600/20' : 'bg-blue-600 text-white shadow-blue-600/20';
  const btnColor     = isSynch
    ? 'bg-violet-600 shadow-violet-600/25 hover:bg-violet-700'
    : 'bg-blue-600 shadow-blue-600/25 hover:bg-blue-700';

  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Calentadores':             return 'bg-blue-50 text-blue-700';
      case 'Cisternas':               return 'bg-emerald-50 text-emerald-700';
      case 'Sistemas de tratamiento': return 'bg-amber-50 text-amber-700';
      default:                        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData('productId', product.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={`bg-white border border-slate-200 rounded-[22px] overflow-hidden transition-all duration-200 flex flex-col cursor-grab active:cursor-grabbing group
        hover:shadow-xl hover:-translate-y-1
        ${isSynch ? 'hover:shadow-violet-600/10 hover:border-violet-200' : 'hover:shadow-blue-600/10 hover:border-blue-200'}
        ${isUnavailable ? 'opacity-55 pointer-events-none' : ''}`}
    >
      {/* Top bar */}
      <div className="p-4 pb-0 flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getCategoryClass(product.category)}`}>
          {product.category}
        </span>
        {product.personas && (
          <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
            <Users className="w-3 h-3" />
            {product.personas} pers.
          </span>
        )}
      </div>

      {/* Image */}
      <div className="h-44 flex items-center justify-center p-4 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className={`max-h-full max-w-full object-contain transition-transform duration-300
              ${product.id === 'cal-80-1p' ? 'group-hover:scale-115' : 'group-hover:scale-105'}
              ${product.id === 'cis-eco-150' ? 'scale-125' : ''}
              ${product.category === 'Calentadores'
                ? (product.id === 'cal-80-2p' ? 'p-5' : (product.id === 'cal-80-1p' ? 'scale-105 translate-y-1' : 'p-1'))
                : ''}`}
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-lg">W</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 pt-1 flex-1 flex flex-col">
        <h3 className="text-[15px] font-black text-slate-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed flex-1 mb-3 line-clamp-2">{product.description}</p>

        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">

          {/* Precio principal */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className={`text-[9px] uppercase tracking-[0.18em] font-bold mb-0.5 ${isSynch ? 'text-violet-400' : 'text-slate-400'}`}>
                {isSynch ? `Mensualidad · ${MODE_LABELS[mode]}` : `Precio · ${MODE_LABELS[mode]}`}
              </div>
              <div className={`font-mono font-black leading-none ${isUnavailable ? 'text-sm italic text-slate-400' : accentColor + ' text-[1.65rem]'}`}>
                {isUnavailable ? 'No disponible' : fmt.format(price)}
              </div>
              {isSynch && !isUnavailable && (
                <div className="text-[9px] font-bold text-violet-400 uppercase tracking-widest mt-0.5">por mes</div>
              )}
            </div>

            {/* Botón agregar */}
            <button
              disabled={isUnavailable}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, isSynch ? selectedInstallments : undefined);
              }}
              className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg
                ${isInCart
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : `${btnColor} text-white hover:scale-105 active:scale-95`}
                disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed`}
            >
              {isInCart ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

          {/* Panel IVU — Cash & Oriental */}
          {!isUnavailable && isCash && product.cashSinIvu && (
            <div className={`${panelBg} rounded-xl px-3 py-2.5 flex flex-col gap-1.5 border ${panelBorder} shadow-sm`}>
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${panelText}`}>Sin IVU</span>
                <span className={`font-mono text-[13px] font-black ${panelText}`}>{fmt.format(product.cashSinIvu)}</span>
              </div>
              <div className="h-px bg-blue-200 opacity-50" />
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${panelText}`}>IVU (11.5%)</span>
                <span className={`font-mono text-[13px] font-bold ${panelText}`}>{fmt.format(product.ivuCash ?? 0)}</span>
              </div>
            </div>
          )}

          {/* Panel Financiado — Synchrony & Kiwi */}
          {!isUnavailable && isSynch && (
            <div className={`${panelBg} rounded-xl px-3 py-2.5 flex flex-col gap-2 border ${panelBorder} shadow-sm`}>
              {/* Total financiado */}
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${panelText}`}>Total Financiado</span>
                <span className={`font-mono text-[13px] font-black ${panelText}`}>{fmt.format(product.prices.synchrony ?? 0)}</span>
              </div>

              {/* IVU del financiado */}
              {product.synchronySinIvu && (
                <>
                  <div className="h-px bg-violet-200 opacity-50" />
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${panelText}`}>Sin IVU</span>
                    <span className={`font-mono text-[12px] font-bold ${panelText}`}>{fmt.format(product.synchronySinIvu)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${panelText}`}>IVU (11.5%)</span>
                    <span className={`font-mono text-[12px] font-bold ${panelText}`}>{fmt.format(product.ivu ?? 0)}</span>
                  </div>
                </>
              )}

              {/* Selector de plazos */}
              <div className={`flex bg-white border ${panelBorder} p-0.5 rounded-lg gap-0.5 mt-0.5`}>
                {([18, 61] as const).map(n => (
                  <button
                    key={n}
                    onClick={(e) => { e.stopPropagation(); setSelectedInstallments(n); }}
                    className={`flex-1 py-1.5 rounded-md text-[9px] font-black transition-all
                      ${selectedInstallments === n ? `${toggleActive} shadow-md` : `${panelText} hover:bg-white/80`}`}
                  >
                    {n} meses · {fmt.format(n === 18 ? (product.prices.m18 ?? 0) : (product.prices.m61 ?? 0))}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
