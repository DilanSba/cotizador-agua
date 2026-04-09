import React from 'react';
import { PaymentMode } from '../types';
import { MODE_LABELS } from '../constants';
import { DarkModeToggle } from './DarkModeToggle';

interface HeaderProps {
  mode: PaymentMode;
  setMode: (mode: PaymentMode) => void;
}

const PAYMENT_GROUPS: { modes: PaymentMode[]; label: string; color: string }[] = [
  {
    modes: ['cash', 'oriental'],
    label: 'Contado',
    color: 'blue',
  },
  {
    modes: ['synchrony', 'kiwi'],
    label: 'Financiado',
    color: 'violet',
  },
];

export const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  const isFinanced = mode === 'synchrony' || mode === 'kiwi';

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-7 px-0 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
          <img 
            src="https://i.postimg.cc/6T5J2v2G/Thumbnail.png" 
            alt="WindMar" 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Cotizador Water Pro</h1>
          <p className="text-xs text-slate-500 font-normal">Cotizador inteligente de sistemas de agua</p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <DarkModeToggle />

        {/* Payment mode selector - 2 groups */}
        <div className="flex flex-col gap-2">
          {/* Group labels */}
          <div className="flex gap-2">
            <span className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest text-blue-500">Contado</span>
            <span className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest text-violet-500">Financiado</span>
          </div>
          {/* Buttons */}
          <div className="flex bg-white border border-slate-200 rounded-full p-1 gap-0.5 shadow-sm">
            {/* Cash */}
            <button
              onClick={() => setMode('cash')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                mode === 'cash' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              💵 Cash
            </button>
            {/* Oriental */}
            <button
              onClick={() => setMode('oriental')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                mode === 'oriental' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              🏛 Oriental
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-1 self-stretch rounded-full" />

            {/* Synchrony */}
            <button
              onClick={() => setMode('synchrony')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                mode === 'synchrony' 
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              🏦 Synchrony
            </button>
            {/* Kiwi */}
            <button
              onClick={() => setMode('kiwi')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                mode === 'kiwi' 
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              🥝 Kiwi
            </button>
          </div>
          {isFinanced && (
            <p className="text-center text-[9px] text-violet-500 font-bold uppercase tracking-widest">
              Sujeto a aprobación de crédito
            </p>
          )}
        </div>
      </div>
    </header>
  );
};
