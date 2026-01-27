import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

import { saveContacts, createCampaign, updateCampaignStatus } from '../lib/supabase';

const SendingPanel = ({ contacts, message, onReset }) => {
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [responseMsg, setResponseMsg] = useState('');

    const handleSend = async () => {
        setStatus('sending');
        let campaignId = null;

        try {
            // 1. Save contacts (if needed, currently we just care about campaign log, but saving contacts is good practice)
            // Ideally we would save contacts first, but for now let's focus on the campaign log which is the critical part for history.
            // Let's assume contacts are just there for the record.

            // 2. Create Campaign Record
            const validContactsCount = contacts.filter(c => c.isValid).length;
            const { data: campaign, error: campError } = await createCampaign(
                `Campanha ${new Date().toLocaleDateString('pt-BR')}`,
                message,
                validContactsCount
            );

            if (campError) throw new Error('Erro ao criar registro da campanha no banco de dados.');
            campaignId = campaign.id;

            // 3. Prepare Payload
            const payload = {
                contatos: contacts.filter(c => c.isValid).map(c => ({
                    nome: c.nome,
                    telefone: c.telefone
                })),
                mensagem: message
            };

            // 4. Send to Webhook
            const response = await axios.post('https://webhook.dev.projetoagenciadeia.shop/webhook/disparo', payload);

            if (response.status === 200 || response.status === 201) {
                setStatus('success');
                setResponseMsg('Disparo iniciado com sucesso!');

                // 5. Update Campaign Status
                if (campaignId) {
                    await updateCampaignStatus(campaignId, 'completed');

                    // Optional: Try to save unique contacts to DB in background
                    saveContacts(contacts).catch(err => console.error("Erro ao salvar contatos em background", err));
                }
            } else {
                throw new Error('Resposta inesperada do servidor.');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setResponseMsg('Erro ao iniciar disparo: ' + (err.response?.data?.message || err.message));

            // Update campaign as failed
            if (campaignId) {
                await updateCampaignStatus(campaignId, 'failed');
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Sucesso!</h2>
                <p className="text-slate-600 mb-8">{responseMsg}</p>
                <button
                    onClick={onReset}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                    Novo Disparo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Resumo do Disparo</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">Total de Contatos Válidos</span>
                        <span className="font-mono font-medium text-slate-800">{contacts.filter(c => c.isValid).length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">Tamanho da Mensagem</span>
                        <span className="font-mono font-medium text-slate-800">{message.length} caracteres</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg mt-4">
                        <span className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2 block">Mensagem Configurada</span>
                        <p className="text-sm text-slate-600 italic whitespace-pre-wrap line-clamp-4">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    {status === 'error' && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
                            <AlertTriangle size={16} className="mr-2" />
                            {responseMsg}
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={status === 'sending'}
                        className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all flex items-center justify-center
               ${status === 'sending'
                                ? 'bg-slate-300 text-slate-500 cursor-wait'
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'}
             `}
                    >
                        {status === 'sending' ? (
                            <>
                                <Loader2 size={24} className="mr-2 animate-spin" />
                                Processando envio...
                            </>
                        ) : (
                            <>
                                <Send size={24} className="mr-2" />
                                Iniciar Disparo em Massa
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Ao clicar, os dados serão enviados para processamento.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SendingPanel;
