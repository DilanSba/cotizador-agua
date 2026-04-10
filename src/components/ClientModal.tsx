import React, { useState } from 'react';
import { FileDown, X, Loader2 } from 'lucide-react';

export interface ClientInfo {
  nombre: string;
  apellido: string;
  telefono: string;
  pueblo: string;
}

interface Props {
  isOpen: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (client: ClientInfo) => void;
}

export const ClientModal: React.FC<Props> = ({ isOpen, isGenerating, onClose, onGenerate }) => {
  const [form, setForm] = useState<ClientInfo>({ nombre: '', apellido: '', telefono: '', pueblo: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});

  if (!isOpen) return null;

  const set = (k: keyof ClientInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!form.nombre.trim())   err.nombre   = 'Requerido';
    if (!form.apellido.trim()) err.apellido = 'Requerido';
    if (!form.telefono.trim()) err.telefono = 'Requerido';
    if (!form.pueblo.trim())   err.pueblo   = 'Requerido';
    if (Object.keys(err).length) { setErrors(err); return; }
    onGenerate(form);
  };

  const Field = ({
    label, fieldKey, placeholder, type = 'text',
  }: { label: string; fieldKey: keyof ClientInfo; placeholder: string; type?: string }) => (
    <div>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        value={form[fieldKey]}
        onChange={set(fieldKey)}
        placeholder={placeholder}
        disabled={isGenerating}
        className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-[13px] font-medium outline-none transition-all disabled:opacity-60
          ${errors[fieldKey]
            ? 'border-red-400 bg-red-50 focus:border-red-500'
            : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
      />
      {errors[fieldKey] && (
        <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors[fieldKey]}</span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={!isGenerating ? onClose : undefined}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-[16px] leading-tight">Cotizacion en PDF</div>
              <div className="text-blue-200 text-[11px] mt-0.5">Ingresa los datos del cliente</div>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-5 flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre *"   fieldKey="nombre"   placeholder="Carlos" />
            <Field label="Apellido *" fieldKey="apellido" placeholder="Perez" />
          </div>
          <Field label="Telefono *" fieldKey="telefono" placeholder="(787) 555-1234" type="tel" />
          <Field label="Pueblo *"   fieldKey="pueblo"   placeholder="San Juan" />

          <div className="flex gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-[13px] shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
                : <><FileDown className="w-4 h-4" /> Generar PDF</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
