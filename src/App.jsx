import React, { useState } from 'react';
import Layout from './components/Layout';
import UploadSection from './components/UploadSection';
import MessageConfig from './components/MessageConfig';
import SendingPanel from './components/SendingPanel';
import Dashboard from './components/Dashboard';
import { Upload, MessageSquare, Send, CheckCircle, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeStep, setActiveStep] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');

  const handleDataLoaded = (data) => {
    setContacts(data);
    setActiveStep(2); // Auto-advance to message config after upload
  };

  const handleClearData = () => {
    setContacts([]);
    setActiveStep(1);
    setMessage('');
  };

  const nextStep = () => {
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'home' ? (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
          {/* Progress Steps */}
          <div className="relative flex items-center justify-between mb-12 px-4 max-w-2xl mx-auto">
            {/* Background Line */}
            <div className="absolute top-[1.25rem] left-0 w-full h-[2px] bg-slate-800 -z-10" />
            <div
              className="absolute top-[1.25rem] left-0 h-[2px] bg-primary transition-all duration-700 -z-10 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
            />

            {[
              { step: 1, label: 'Upload', icon: Upload },
              { step: 2, label: 'Mensagem', icon: MessageSquare },
              { step: 3, label: 'Disparo', icon: Send }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 shadow-2xl
                    ${activeStep >= step
                      ? 'bg-primary border-primary text-white scale-110 shadow-primary/20'
                      : 'bg-slate-900 border-slate-800 text-slate-500'}
                  `}
                >
                  <Icon size={18} className={activeStep === step ? 'animate-pulse' : ''} />
                </div>
                <span className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300
                    ${activeStep >= step ? 'text-primary' : 'text-slate-600'}
                `}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="transition-all duration-500">
            {activeStep === 1 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {contacts.length === 0 ? (
                  <UploadSection onDataLoaded={handleDataLoaded} />
                ) : (
                  <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">Preview da Lista</h3>
                        <p className="text-xs text-slate-400 font-medium">
                          <span className="text-primary">{contacts.length}</span> contatos encontrados •
                          <span className="text-green-400"> {contacts.filter(c => c.isValid).length}</span> válidos
                        </p>
                      </div>
                      <button
                        onClick={handleClearData}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10 active:scale-95"
                        title="Limpar / Novo Upload"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/50 text-[10px] uppercase font-black tracking-widest text-slate-500">
                            <th className="px-8 py-4 border-b border-white/5">#</th>
                            <th className="px-4 py-4 border-b border-white/5 text-slate-300">Nome</th>
                            <th className="px-4 py-4 border-b border-white/5">Original</th>
                            <th className="px-4 py-4 border-b border-white/5">Formatado</th>
                            <th className="px-8 py-4 border-b border-white/5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {contacts.slice(0, 5).map((contact, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                              <td className="px-8 py-4 text-slate-600 font-mono text-xs italic">{idx + 1}</td>
                              <td className="px-4 py-4 text-slate-200 font-medium">{contact.nome}</td>
                              <td className="px-4 py-4 text-slate-500 font-mono text-xs">{contact.original.contato}</td>
                              <td className="px-4 py-4 font-mono text-primary text-xs">{contact.telefone || '-'}</td>
                              <td className="px-8 py-4 text-right">
                                {contact.isValid ?
                                  <span className="inline-flex items-center text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-400/20">
                                    <CheckCircle size={10} className="mr-1" /> VÁLIDO
                                  </span> :
                                  <span className="inline-flex items-center text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-400/20">
                                    <AlertTriangle size={10} className="mr-1" /> INVÁLIDO
                                  </span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {contacts.length > 5 && (
                      <div className="p-4 text-center text-[10px] font-bold text-slate-600 border-t border-white/5 tracking-widest uppercase">
                        Exibindo os primeiros 5 de {contacts.length} registros
                      </div>
                    )}

                    <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end">
                      <button
                        onClick={nextStep}
                        disabled={contacts.filter(c => c.isValid).length === 0}
                        className={`group px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl flex items-center gap-3
                             ${contacts.filter(c => c.isValid).length > 0
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 scale-[1.02] active:scale-[0.98]'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                           `}
                      >
                        Próximo: Configurar Mensagem
                        <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <MessageConfig
                initialMessage={message}
                onMessageChange={setMessage}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {activeStep === 3 && (
              <SendingPanel
                contacts={contacts}
                message={message}
                onReset={handleClearData}
                onViewChange={setCurrentView}
              />
            )}
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </Layout>
  );
}

export default App;
