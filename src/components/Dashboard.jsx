import React, { useEffect, useState } from 'react';
import { getCampaigns, updateCampaignStatus } from '../lib/supabase';
import { Calendar, Users, MessageSquare, CheckCircle, Clock, Pause, Play, XCircle, Loader2, ArrowUpRight, Search, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        const { data, error } = await getCampaigns();
        if (error) {
            console.error('Erro ao buscar campanhas:', error);
        } else {
            setCampaigns(data || []);
        }
        setLoading(false);
    };

    const handleCommand = async (campaign, command) => {
        const newStatus = command === 'pause' ? 'paused' : command === 'resume' ? 'sending' : 'cancelled';

        // Optimistic update
        const previousCampaigns = [...campaigns];
        setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, status: newStatus, isProcessing: true } : c));

        try {
            const { error } = await updateCampaignStatus(campaign.id, newStatus);
            if (error) throw error;

        } catch (error) {
            console.error(`Erro ao processar comando ${command}:`, error);
            alert(`Falha ao processar comando.`);
            setCampaigns(previousCampaigns);
        } finally {
            setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, isProcessing: false } : c));
            fetchCampaigns();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const statusConfig = {
        completed: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle, label: 'Concluído' },
        sending: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Loader2, label: 'Enviando', animate: 'animate-spin' },
        paused: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Pause, label: 'Pausado' },
        cancelled: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, label: 'Cancelado' },
        draft: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock, label: 'Rascunho' },
        failed: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle, label: 'Falhou' },
    };

    const stats = {
        total: campaigns.length,
        sending: campaigns.filter(c => c.status === 'sending').length,
        completed: campaigns.filter(c => c.status === 'completed').length,
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message_content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-40 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse font-medium">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            {/* Header + Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Histórico de Campanhas</h2>
                    <p className="text-slate-400">Acompanhe e controle seus disparos em tempo real.</p>
                </div>

                <div className="flex gap-4">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'Ativas', value: stats.sending, color: 'text-primary' },
                        { label: 'Concluídas', value: stats.completed, color: 'text-green-400' },
                    ].map((stat, i) => (
                        <div key={i} className="glass px-6 py-3 rounded-2xl border border-white/5 space-y-0.5">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{stat.label}</p>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar campanha ou mensagem..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                </div>
                <button
                    onClick={fetchCampaigns}
                    className="px-6 py-3 glass hover:bg-white/5 text-sm font-medium border border-white/5 rounded-2xl transition-all"
                >
                    Atualizar
                </button>
            </div>

            {/* Grid */}
            {filteredCampaigns.length === 0 ? (
                <div className="glass-card rounded-3xl p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                        <MessageSquare size={32} />
                    </div>
                    <div>
                        <p className="text-white font-medium">Nenhuma campanha encontrada</p>
                        <p className="text-slate-500 text-sm">Tente mudar sua pesquisa ou crie um novo disparo.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((camp) => {
                        const config = statusConfig[camp.status] || statusConfig.draft;
                        return (
                            <div key={camp.id} className="glass-card rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-white/5 flex flex-col">
                                <div className="p-6 flex-1 space-y-6">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${config.color}`}>
                                            <config.icon size={12} className={config.animate} />
                                            {config.label.toUpperCase()}
                                        </div>
                                        <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{camp.name}</h3>
                                        <div className="flex items-center text-xs text-slate-500 gap-4">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Calendar size={14} className="text-primary" />
                                                {formatDate(camp.created_at)}
                                            </div>
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Users size={14} className="text-primary" />
                                                {camp.total_contacts}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                            {camp.message_content}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {(camp.status === 'sending' || camp.status === 'paused') && (
                                    <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                                        {camp.status === 'sending' ? (
                                            <button
                                                onClick={() => handleCommand(camp, 'pause')}
                                                disabled={camp.isProcessing}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-bold transition-all border border-amber-500/20"
                                            >
                                                {camp.isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Pause size={14} />}
                                                PAUSAR
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCommand(camp, 'resume')}
                                                disabled={camp.isProcessing}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-xl text-xs font-bold transition-all border border-green-500/20"
                                            >
                                                {camp.isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                                                RETOMAR
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleCommand(camp, 'cancel')}
                                            disabled={camp.isProcessing}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all border border-red-500/20"
                                        >
                                            {camp.isProcessing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                            CANCELAR
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
