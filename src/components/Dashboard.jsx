import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../lib/supabase';
import { Calendar, Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Histórico de Campanhas</h2>
                <button
                    onClick={fetchCampaigns}
                    className="text-sm text-primary hover:underline"
                >
                    Atualizar
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center border border-slate-200 shadow-sm">
                    <p className="text-slate-500">Nenhuma campanha encontrada.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {campaigns.map((camp) => (
                        <div key={camp.id} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">{camp.name}</h3>
                                    <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <Calendar size={14} className="mr-1" />
                                        {formatDate(camp.created_at)}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center
                  ${camp.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        camp.status === 'sending' ? 'bg-blue-100 text-blue-700' :
                                            camp.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}
                `}>
                                    {camp.status === 'completed' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                    {camp.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <span className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-1 block">Mensagem</span>
                                    <p className="text-sm text-slate-600 line-clamp-2" title={camp.message_content}>
                                        {camp.message_content}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center bg-slate-50 p-3 rounded border border-slate-100">
                                    <div className="text-center">
                                        <span className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-1 block">Contatos</span>
                                        <div className="flex items-center justify-center text-xl font-bold text-slate-700">
                                            <Users size={20} className="mr-2 text-primary" />
                                            {camp.total_contacts}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
