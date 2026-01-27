import React, { useState } from 'react';
import Layout from './components/Layout';
import UploadSection from './components/UploadSection';
import MessageConfig from './components/MessageConfig';
import SendingPanel from './components/SendingPanel';
import Dashboard from './components/Dashboard';
import { Upload, MessageSquare, Send, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeStep, setActiveStep] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');

  const handleDataLoaded = (data) => {
    setContacts(data);
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
            {[
              { step: 1, label: 'Upload', icon: Upload },
              { step: 2, label: 'Mensagem', icon: MessageSquare },
              { step: 3, label: 'Disparo', icon: Send }
            ].map(({ step, label, icon: Icon }) => (
              <React.Fragment key={step}>
                <div
                  className={`flex flex-col items-center z-10 ${activeStep >= step ? 'text-primary' : 'text-slate-400'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${activeStep >= step ? 'bg-primary text-white shadow-lg scale-110' : 'bg-slate-200'}
                    `}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {step < 3 && (
                  <div className={`h-1 flex-1 mx-4 rounded transition-all duration-500 ${activeStep > step ? 'bg-primary' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Content Area */}
          <div className="transition-all duration-300">
            {activeStep === 1 && (
              <div className="space-y-6">
                {contacts.length === 0 ? (
                  <UploadSection onDataLoaded={handleDataLoaded} />
                ) : (
                  <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                        <h3 className="font-semibold text-slate-800">Preview dos Dados</h3>
                        <p className="text-sm text-slate-500">{contacts.length} contatos importados ({contacts.filter(c => c.isValid).length} válidos)</p>
                      </div>
                      <button
                        onClick={handleClearData}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1.5" />
                        Limpar / Novo Upload
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                          <tr>
                            <th className="px-4 py-3">Linha</th>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Contato Original</th>
                            <th className="px-4 py-3">Contato Formatado</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {contacts.slice(0, 5).map((contact, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 text-slate-800">{contact.nome}</td>
                              <td className="px-4 py-3 text-slate-500 font-mono">{contact.original.contato}</td>
                              <td className="px-4 py-3 font-mono text-slate-700">{contact.telefone || '-'}</td>
                              <td className="px-4 py-3">
                                {contact.isValid ?
                                  <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <CheckCircle size={12} className="mr-1" /> Válido
                                  </span> :
                                  <span className="inline-flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <AlertTriangle size={12} className="mr-1" /> Inválido
                                  </span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {contacts.length > 5 && (
                      <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                        E mais {contacts.length - 5} contatos...
                      </div>
                    )}

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={nextStep}
                        disabled={contacts.filter(c => c.isValid).length === 0}
                        className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all
                             ${contacts.filter(c => c.isValid).length > 0
                            ? 'bg-primary text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                           `}
                      >
                        Próximo: Configurar Mensagem
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
