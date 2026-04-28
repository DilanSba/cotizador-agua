import React, { useState } from 'react';
import { FileDown, X, Loader2, User, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentMode, CotizacionFormData, ConsultorInfo, ClienteInfo } from '../types';

// ─── InputField fuera del componente padre para evitar remount en cada render ─

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label, value, onChange, placeholder, type = 'text',
  autoComplete, required = false, error, disabled,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
      {label}{required && <span className="text-blue-400 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      autoComplete={autoComplete}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-all bg-slate-800 border disabled:opacity-60 placeholder:text-slate-600 text-white
        ${error ? 'border-red-500 bg-red-900/20' : 'border-slate-700 focus:border-blue-500'}`}
    />
    {error && <span className="text-[10px] text-red-400 font-semibold">{error}</span>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (data: CotizacionFormData) => void;
}

type FormErrors = {
  consultorNombre?: string;
  clienteNombre?: string;
  modos?: string;
};

const MODES: { key: PaymentMode; label: string; activeClass: string }[] = [
  { key: 'cash',      label: 'CASH',      activeClass: 'bg-blue-600 border-blue-500 text-white' },
  { key: 'synchrony', label: 'SYNCHRONY', activeClass: 'bg-violet-600 border-violet-500 text-white' },
  { key: 'oriental',  label: 'ORIENTAL',  activeClass: 'bg-emerald-600 border-emerald-500 text-white' },
  { key: 'kiwi',      label: 'KIWI',      activeClass: 'bg-amber-500 border-amber-400 text-white' },
];

export const CotizacionModal: React.FC<Props> = ({ isOpen, isGenerating, onClose, onGenerate }) => {
  const [consultor, setConsultor] = useState<ConsultorInfo>({ nombre: '', correo: '', telefono: '' });
  const [cliente, setCliente] = useState<ClienteInfo>({ nombre: '', correo: '', telefono: '', direccion: '' });
  const [selectedModes, setSelectedModes] = useState<PaymentMode[]>(['cash']);
  const [installmentsSync, setInstallmentsSync] = useState<(18 | 61)[]>([18]);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const toggleMode = (mode: PaymentMode) => {
    setSelectedModes(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
    setErrors(e => ({ ...e, modos: undefined }));
  };

  const toggleInstallment = (
    current: (18 | 61)[],
    set: React.Dispatch<React.SetStateAction<(18 | 61)[]>>,
    val: 18 | 61,
  ) => {
    if (current.includes(val)) {
      if (current.length === 1) return;
      set(current.filter(i => i !== val));
    } else {
      set([...current, val]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: FormErrors = {};
    if (!consultor.nombre.trim()) err.consultorNombre = 'Requerido';
    if (!cliente.nombre.trim())   err.clienteNombre   = 'Requerido';
    if (selectedModes.length === 0) err.modos = 'Selecciona al menos un modo';
    if (Object.keys(err).length) { setErrors(err); return; }
    onGenerate({ consultor, cliente, selectedModes, installmentsSync, installmentsKiwi: [] });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={!isGenerating ? onClose : undefined}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 bg-[#0f172a] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                <FileDown className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-black text-[15px] leading-tight">Datos de Cotización</div>
                <div className="text-slate-500 text-[11px]">Completa la información para el PDF</div>
              </div>
            </div>
            {!isGenerating && (
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} autoComplete="on" className="p-6 flex flex-col gap-5">
            {/* Two-column grid: Consultor | Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Consultor */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Consultor</span>
                </div>
                <InputField
                  label="Nombre"
                  required
                  value={consultor.nombre}
                  autoComplete="name"
                  onChange={v => { setConsultor(p => ({ ...p, nombre: v })); setErrors(e => ({ ...e, consultorNombre: undefined })); }}
                  placeholder="Tu nombre completo"
                  error={errors.consultorNombre}
                  disabled={isGenerating}
                />
                <InputField
                  label="Correo"
                  type="email"
                  value={consultor.correo}
                  autoComplete="email"
                  onChange={v => setConsultor(p => ({ ...p, correo: v }))}
                  placeholder="correo@windmar.com"
                  disabled={isGenerating}
                />
                <InputField
                  label="Teléfono"
                  type="tel"
                  value={consultor.telefono}
                  autoComplete="tel"
                  onChange={v => setConsultor(p => ({ ...p, telefono: v }))}
                  placeholder="787-000-0000"
                  disabled={isGenerating}
                />
              </div>

              {/* Cliente */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Cliente</span>
                </div>
                <InputField
                  label="Nombre"
                  required
                  value={cliente.nombre}
                  autoComplete="off"
                  onChange={v => { setCliente(p => ({ ...p, nombre: v })); setErrors(e => ({ ...e, clienteNombre: undefined })); }}
                  placeholder="Nombre del cliente"
                  error={errors.clienteNombre}
                  disabled={isGenerating}
                />
                <InputField
                  label="Correo"
                  type="email"
                  value={cliente.correo}
                  autoComplete="off"
                  onChange={v => setCliente(p => ({ ...p, correo: v }))}
                  placeholder="cliente@email.com"
                  disabled={isGenerating}
                />
                <InputField
                  label="Teléfono"
                  type="tel"
                  value={cliente.telefono}
                  autoComplete="off"
                  onChange={v => setCliente(p => ({ ...p, telefono: v }))}
                  placeholder="787-000-0000"
                  disabled={isGenerating}
                />
                <InputField
                  label="Dirección"
                  value={cliente.direccion}
                  autoComplete="off"
                  onChange={v => setCliente(p => ({ ...p, direccion: v }))}
                  placeholder="Ciudad, Puerto Rico"
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Payment modes */}
            <div className="border-t border-slate-700/60 pt-4">
              <div className="flex items-center gap-2 mb-1">
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Modos de Pago en el PDF</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                Selecciona uno o más modos — el PDF mostrará los precios de cada uno
              </p>

              {errors.modos && (
                <p className="text-[11px] text-red-400 font-semibold mb-2">{errors.modos}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {MODES.map(mode => {
                  const active = selectedModes.includes(mode.key);
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => toggleMode(mode.key)}
                      disabled={isGenerating}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50
                        ${active ? mode.activeClass : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${active ? 'border-white bg-white/30' : 'border-slate-600'}`}>
                        {active && <div className="w-1 h-1 rounded-full bg-white" />}
                      </div>
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              {/* Synchrony installments */}
              {selectedModes.includes('synchrony') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-violet-900/20 border border-violet-700/30 rounded-xl overflow-hidden"
                >
                  <p className="text-[10px] font-bold text-violet-300 uppercase tracking-[0.15em] mb-2">
                    Synchrony — Plazo de cuotas
                  </p>
                  <div className="flex gap-2">
                    {([18, 61] as const).map(m => (
                      <button key={m} type="button" disabled={isGenerating}
                        onClick={() => toggleInstallment(installmentsSync, setInstallmentsSync, m)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all
                          ${installmentsSync.includes(m)
                            ? 'bg-violet-600 border-violet-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-violet-500/50'}`}
                      >
                        {m} meses
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-slate-800 hover:text-slate-200 transition-all disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isGenerating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
                  : <><FileDown className="w-4 h-4" /> Generar y Descargar PDF</>}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
