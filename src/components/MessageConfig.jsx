import React, { useState, useEffect } from 'react';
import { MessageSquare, Type, Info } from 'lucide-react';

const MessageConfig = ({ initialMessage, onMessageChange, onNext, onBack }) => {
    const [message, setMessage] = useState(initialMessage || '');

    useEffect(() => {
        onMessageChange(message);
    }, [message, onMessageChange]);

    const insertVariable = (variable) => {
        setMessage(prev => prev + ` {${variable}} `);
    };

    const isValid = message.trim().length > 0;

    // Simple preview with mock data
    const previewMessage = message.replace(/{nome}/g, 'Maria da Silva');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor Side */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                        <MessageSquare size={18} className="mr-2 text-primary" />
                        Editor de Mensagem
                    </h3>
                    <span className="text-xs text-slate-500">{message.length} caracteres</span>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                            Variáveis Disponíveis
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => insertVariable('nome')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors border border-slate-200 flex items-center"
                            >
                                <Type size={14} className="mr-1.5" />
                                Nome do Cliente
                            </button>
                        </div>
                    </div>

                    <textarea
                        className="flex-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-slate-700 leading-relaxed"
                        placeholder="Digite sua mensagem aqui..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-between">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`px-6 py-2 rounded-lg font-medium transition-all
              ${isValid
                                ? 'bg-primary text-white hover:bg-slate-800 shadow-sm'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
                    >
                        Próximo: Revisão e Disparo
                    </button>
                </div>
            </div>

            {/* Preview Side */}
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-blue-50">
                        <h3 className="font-semibold text-primary flex items-center text-sm uppercase tracking-wide">
                            <Info size={16} className="mr-2" />
                            Visualização (Exemplo)
                        </h3>
                    </div>
                    <div className="p-6 bg-slate-50 min-h-[200px] flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 max-w-sm w-full relative">
                            {/* Mock Message Bubble */}
                            <div className="bg-[#e7f5ff] p-3 rounded-lg rounded-tl-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                                {previewMessage || <span className="text-slate-400 italic">Sua mensagem aparecerá aqui...</span>}
                            </div>
                            <div className="mt-1 text-[10px] text-slate-400 text-right">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-blue-800 font-medium text-sm mb-2">Dicas Importantes</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Use <strong>{'{nome}'}</strong> para personalizar cada mensagem.</li>
                        <li>Seja conciso e cordial.</li>
                        <li>Verifique a ortografia antes de enviar.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MessageConfig;
