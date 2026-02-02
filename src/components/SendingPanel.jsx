import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, AlertTriangle, Loader2, Pause, Play, XCircle, LayoutDashboard, Info, Hash, Clock, Terminal, AlertCircle, Users } from 'lucide-react';

import { createCampaign, updateCampaignStatus } from '../lib/supabase';

const SendingPanel = ({ contacts, message, onReset, onViewChange }) => {
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [responseMsg, setResponseMsg] = useState('');
    const [currentCampaign, setCurrentCampaign] = useState(null);
    const [isProcessingCommand, setIsProcessingCommand] = useState(false);

    const handleSend = async () => {
        setStatus('sending');
        let campaignId = null;

        try {
            const validContactsCount = contacts.filter(c => c.isValid).length;
            const { data: campaign, error: campError } = await createCampaign(
                `Campanha ${new Date().toLocaleDateString('pt-BR')}`,
                message,
                validContactsCount
            );

            if (campError) throw new Error('Erro ao criar registro da campanha.');
            campaignId = campaign.id;
            setCurrentCampaign(campaign);

            const payload = {
                contatos: contacts.filter(c => c.isValid).map(c => ({
                    nome: c.nome,
                    telefone: c.telefone
                })),
                mensagem: message
            };

            const webhookUrl = import.meta.env.VITE_WEBHOOK_COMMAND_URL || 'https://webhook.dev.projetoagenciadeia.shop/webhook/disparo';
            const response = await axios.post(webhookUrl, payload);

            if (response.status === 200 || response.status === 201) {
                setStatus('success');
                setResponseMsg('Disparo iniciado! O servidor está processando as mensagens.');
            } else {
                throw new Error('Resposta inesperada do servidor.');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setResponseMsg('Falha ao iniciar: ' + (err.response?.data?.message || err.message));

            if (campaignId) {
                await updateCampaignStatus(campaignId, 'failed');
            }
        }
    };

    const handleCommand = async (command) => {
        if (!currentCampaign) return;

        const newStatus = command === 'pause' ? 'paused' : command === 'resume' ? 'sending' : 'cancelled';
        setIsProcessingCommand(true);

        try {
            const { error } = await updateCampaignStatus(currentCampaign.id, newStatus);
            if (error) throw error;

            setCurrentCampaign(prev => ({ ...prev, status: newStatus }));
            setResponseMsg(`Campanha ${command === 'pause' ? 'pausada' : command === 'resume' ? 'retomada' : 'cancelada'}.`);

        } catch (error) {
            console.error(error);
            alert(`Falha ao processar comando.`);
        } finally {
            setIsProcessingCommand(false);
        }
    };

    if (status === 'success') {
        const campStatus = currentCampaign?.status || 'sending';

        return (
            <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                <div className="glass-card rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />

                    <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl transition-all duration-700
                        ${campStatus === 'cancelled' ? 'bg-red-500 rotate-12' :
                            campStatus === 'paused' ? 'bg-amber-500 rounded-full' : 'bg-green-500 scale-110 active:scale-100'}
                    `}>
                        {campStatus === 'cancelled' ? <XCircle size={48} className="text-white" /> :
                            campStatus === 'paused' ? <Pause size={48} className="text-white" /> : <CheckCircle size={48} className="text-white" />}
                    </div>

                    <div className="space-y-3 mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tight leading-none">
                            {campStatus === 'cancelled' ? 'Cancelado' :
                                campStatus === 'paused' ? 'Pausado' : 'Tudo Pronto!'}
                        </h2>
                        <p className="text-slate-400 text-lg font-medium">{responseMsg}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
                        {campStatus === 'sending' && (
                            <button
                                onClick={() => handleCommand('pause')}
                                disabled={isProcessingCommand}
                                className="flex items-center justify-center gap-3 py-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-2xl font-bold transition-all border border-amber-500/20 shadow-lg shadow-amber-500/5 group"
                            >
                                {isProcessingCommand ? <Loader2 size={20} className="animate-spin" /> : <Pause size={20} className="group-hover:scale-110 transition-transform" />}
                                PAUSAR AGORA
                            </button>
                        )}
                        {campStatus === 'paused' && (
                            <button
                                onClick={() => handleCommand('resume')}
                                disabled={isProcessingCommand}
                                className="flex items-center justify-center gap-3 py-4 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-2xl font-bold transition-all border border-green-500/20 shadow-lg shadow-green-500/5 group"
                            >
                                {isProcessingCommand ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} className="group-hover:scale-110 transition-transform" />}
                                RETOMAR ENVIO
                            </button>
                        )}
                        {(campStatus === 'sending' || campStatus === 'paused') && (
                            <button
                                onClick={() => handleCommand('cancel')}
                                disabled={isProcessingCommand}
                                className="flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl font-bold transition-all border border-red-500/20 shadow-lg shadow-red-500/5 group"
                            >
                                {isProcessingCommand ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} className="group-hover:scale-110 transition-transform" />}
                                CANCELAR TUDO
                            </button>
                        )}
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-slate-300 rounded-2xl hover:bg-white/10 transition-all font-bold border border-white/5"
                        >
                            <Send size={20} />
                            NOVO DISPARO
                        </button>
                        <button
                            onClick={() => onViewChange && onViewChange('dashboard')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 scale-[1.02] active:scale-[0.98]"
                        >
                            <LayoutDashboard size={20} />
                            VER HISTÓRICO
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white tracking-tight">Revisão Final</h2>
                <p className="text-slate-400">Confirme os detalhes antes de iniciar o disparo em massa.</p>
            </div>

            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold text-white flex items-center gap-2 tracking-tight">
                        <Terminal size={20} className="text-primary" />
                        RESUMO DA CAMPANHA
                    </h3>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass p-5 rounded-2xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Users size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Contatos</span>
                            </div>
                            <span className="text-3xl font-black text-white">{contacts.filter(c => c.isValid).length}</span>
                        </div>
                        <div className="glass p-5 rounded-2xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Hash size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Caracteres</span>
                            </div>
                            <span className="text-3xl font-black text-white">{message.length}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquareDotIcon size={14} className="text-primary" />
                            Conteúdo da Mensagem
                        </span>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 group relative">
                            <p className="text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                                {message}
                            </p>
                            <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/10 transition-colors">
                                <Terminal size={40} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200/80 leading-relaxed">
                            <span className="font-bold text-blue-200">Atenção:</span> Após o início, você poderá pausar ou cancelar o disparo a partir desta tela ou do dashboard.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5">
                    {status === 'error' && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center animate-in shake duration-300">
                            <AlertCircle size={20} className="mr-3 shrink-0" />
                            {responseMsg}
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={status === 'sending'}
                        className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden group relative
                            ${status === 'sending'
                                ? 'bg-slate-800 text-slate-500 cursor-wait'
                                : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-primary/30'}
                        `}
                    >
                        {status === 'sending' ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                INICIANDO...
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                INICIAR DISPARO EM MASSA
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-600 mt-6 tracking-widest uppercase">
                        SISTEMA DE ALTA PERFORMANCE • ATTO DISPARO
                    </p>
                </div>
            </div>
        </div>
    );
};

const MessageSquareDotIcon = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M11 17h1" />
        <path d="M14 17h1" />
        <path d="M17 17h1" />
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

export default SendingPanel;
