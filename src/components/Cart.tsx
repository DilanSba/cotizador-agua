import { useState } from 'react';
import { FileDown } from 'lucide-react';

type PaymentMode = 'cash' | 'synchrony' | 'oriental' | 'kiwi';

interface Product {
  id: string;
  name: string;
  prices: {
    cash: number | null;
    synchrony: number | null;
    m18: number | null;
    m61: number | null;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
  installments?: 18 | 61;
}

interface CartProps {
  items: CartItem[];
  mode: PaymentMode;
  hasBonus: boolean;
  downPayment: number;
  onToggleBonus: () => void;
  onUpdateDownPayment: (value: number) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onUpdateInstallments: (id: string, installments: 18 | 61) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onCopy: () => void;
  onWhatsApp: () => void;
  onPDF: () => void;
}

function getItemPrice(item: CartItem, mode: PaymentMode): number {
  const { prices } = item.product;
  if (mode === 'cash' || mode === 'oriental') return prices.cash ?? 0;
  if (mode === 'kiwi') return prices.synchrony ?? 0;
  if (mode === 'synchrony') {
    const inst = item.installments ?? 18;
    return inst === 61 ? (prices.m61 ?? 0) : (prices.m18 ?? 0);
  }
  return 0;
}

const RO_PRODUCT_ID = 'trat-ro';

export function Cart({
  items,
  mode,
  hasBonus,
  downPayment,
  onToggleBonus,
  onUpdateDownPayment,
  onUpdateQty,
  onUpdateInstallments,
  onRemoveItem,
  onClear,
  onCopy,
  onWhatsApp,
  onPDF,
}: CartProps) {
  const hasRO = items.some((i) => i.product.id === RO_PRODUCT_ID);
  const hasOtherProduct = items.some((i) => i.product.id !== RO_PRODUCT_ID);
  const showRODiscount = hasRO && hasOtherProduct;

  const subtotal = items.reduce((sum, item) => {
    return sum + getItemPrice(item, mode) * item.quantity;
  }, 0);

  const roItem = items.find((i) => i.product.id === RO_PRODUCT_ID);
  const roItemTotal = roItem ? getItemPrice(roItem, mode) * roItem.quantity : 0;
  const otherItemsTotal = subtotal - roItemTotal;
  const roDiscount = showRODiscount ? 1000 : 0;
  const bonusDiscount = hasBonus && subtotal > 0 ? 500 : 0;
  const total = subtotal - roDiscount - bonusDiscount;
  const remaining = Math.max(0, total - downPayment);

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  if (items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <p className="text-lg font-medium">El carrito esta vacio</p>
        <p className="text-sm mt-1">Agrega productos para ver el resumen aqui</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-blue-700 px-5 py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg tracking-wide">
          Carrito ({items.length} {items.length === 1 ? 'producto' : 'productos'})
        </h2>
        <button
          onClick={onClear}
          className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Items list */}
      <div className="divide-y divide-slate-700">
        {items.map((item) => {
          const price = getItemPrice(item, mode);
          const lineTotal = price * item.quantity;
          return (
            <div key={item.product.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-blue-300 text-xs mt-0.5">{fmt(price)} c/u</p>
                  {mode === 'synchrony' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onUpdateInstallments(item.product.id, 18)}
                        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                          (item.installments ?? 18) === 18
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        18 meses
                      </button>
                      <button
                        onClick={() => onUpdateInstallments(item.product.id, 61)}
                        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                          item.installments === 61
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        61 meses
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.product.id, -1)}
                    className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    &minus;
                  </button>
                  <span className="text-white font-semibold w-5 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.product.id, 1)}
                    className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="w-7 h-7 rounded-full bg-red-900/50 hover:bg-red-700 text-red-300 hover:text-white font-bold flex items-center justify-center transition-colors ml-1"
                    title="Eliminar"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-slate-300 text-sm font-semibold">{fmt(lineTotal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discounts and totals */}
      <div className="px-5 py-4 bg-slate-900/50 space-y-3">
        {showRODiscount && (
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg px-3 py-2 text-xs text-emerald-200">
            <p className="font-bold text-emerald-300 mb-0.5">💧 Bundle Reverse Osmosis: -$1,000</p>
            <p className="text-emerald-300/80">¿Comprarás un Reverse Osmosis junto a un producto de WindMar Home? Se aplica descuento de $1,000 en el RO.</p>
            <span className="float-right text-green-400 font-bold mt-1">-{fmt(roDiscount)}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <button
            onClick={onToggleBonus}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              hasBonus
                ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <span>☀️💧</span>
              <div>
                <p className="text-xs font-bold leading-tight">Bundle Solar + Agua (-$500)</p>
                <p className={`text-[10px] leading-tight mt-0.5 ${hasBonus ? 'text-emerald-200' : 'text-slate-400'}`}>Programa Firma y Gana · Referidos</p>
              </div>
            </div>
            <div className={`w-8 h-4 rounded-full relative flex-shrink-0 transition-colors ${hasBonus ? 'bg-white/30' : 'bg-slate-600'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${hasBonus ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>
          {hasBonus && (
            <div className="px-3 py-1.5 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-[10px] text-emerald-300">
              ¿Comprarás un sistema solar junto a tu solución de agua? Se aplica descuento de $500 al participar en nuestro Programa de Referidos, Firma y Gana.
            </div>
          )}
          {hasBonus && (
            <div className="flex justify-end">
              <span className="text-green-400 text-sm font-bold">-{fmt(bonusDiscount)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-slate-300 text-sm font-medium whitespace-nowrap">
            Pronto pago:
          </label>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              $
            </span>
            <input
              type="number"
              min={0}
              value={downPayment || ''}
              onChange={(e) => onUpdateDownPayment(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-700 pt-3 space-y-1.5">
          {(roDiscount > 0 || bonusDiscount > 0) && (
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal:</span>
              <span>{fmt(subtotal)}</span>
            </div>
          )}
          {roDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Bundle RO (-$1,000):</span>
              <span>-{fmt(roDiscount)}</span>
            </div>
          )}
          {bonusDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Bundle Solar + Agua (-$500):</span>
              <span>-{fmt(bonusDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total:</span>
            <span className="text-blue-300">{fmt(total)}</span>
          </div>
          {downPayment > 0 && (
            <div className="flex justify-between text-sm text-slate-300">
              <span>Balance financiado:</span>
              <span>{fmt(remaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* PDF button */}
      <div className="px-5 pt-4">
        <button
          onClick={onPDF}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
        >
          <FileDown className="w-4 h-4" />
          Generar Cotización PDF
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 flex gap-3">
        <button
          onClick={onCopy}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          Copiar resumen
        </button>
        <button
          onClick={onWhatsApp}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
}
