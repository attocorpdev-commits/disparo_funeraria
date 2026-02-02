import React from 'react';
import { Type, ArrowRight, ArrowLeft, Terminal, MessageSquareDot } from 'lucide-react';

const MessageConfig = ({ initialMessage, onMessageChange, onNext, onBack }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white tracking-tight">Configurar Mensagem</h2>
                <p className="text-slate-400">Escreva o conteúdo que será enviado para seus contatos.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <Type size={16} className="text-primary" />
                            CORPO DA MENSAGEM
                        </label>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border
                            ${initialMessage.length > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-800 text-slate-500 border-white/5'}
                        `}>
                            {initialMessage.length} CARACTERES
                        </span>
                    </div>

                    <div className="relative group">
                        <textarea
                            value={initialMessage}
                            onChange={(e) => onMessageChange(e.target.value)}
                            placeholder="Olá, como vai? Digite sua mensagem aqui..."
                            className="w-full min-h-[250px] bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-lg leading-relaxed resize-none"
                        />
                        <div className="absolute bottom-4 right-4 text-slate-700 pointer-events-none group-focus-within:text-primary transition-colors">
                            <Terminal size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquareDot size={14} className="text-primary" />
                        Prévia rápida
                    </h4>
                    <p className={`text-sm leading-relaxed ${initialMessage ? 'text-slate-200' : 'text-slate-500 italic'}`}>
                        {initialMessage || 'A prévia da sua mensagem aparecerá aqui conforme você digita...'}
                    </p>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 glass hover:bg-white/5 text-slate-300 font-bold rounded-2xl transition-all border border-white/5"
                    >
                        <ArrowLeft size={18} />
                        VOLTAR
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!initialMessage.trim()}
                        className={`flex-[2] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all shadow-xl
                            ${initialMessage.trim()
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 scale-[1.02] active:scale-[0.98]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        CONTINUAR
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-primary font-bold">Dica:</span> Use mensagens claras e objetivas para aumentar a taxa de leitura.
                    </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-primary font-bold">Nota:</span> Você poderá revisar tudo na próxima tela antes de iniciar o disparo.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessageConfig;
