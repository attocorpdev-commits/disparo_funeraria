import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { isValidCSVHeader, validatePhone } from '../utils/validators';
import { saveContacts } from '../lib/supabase';

const UploadSection = ({ onDataLoaded }) => {
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFile = (file) => {
        setError(null);
        setUploadSuccess(false);

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Por favor, envie apenas arquivos CSV.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (results.errors.length > 0) {
                    setError('Erro ao ler o arquivo CSV. Verifique o formato.');
                    return;
                }

                const headers = results.meta.fields;
                if (!isValidCSVHeader(headers)) {
                    setError('O arquivo deve conter as colunas: "nome" e "contato".');
                    return;
                }

                const validData = results.data.map(row => {
                    const contactKey = Object.keys(row).find(k => k.toLowerCase().trim() === 'contato');
                    const nameKey = Object.keys(row).find(k => k.toLowerCase().trim() === 'nome');

                    if (!contactKey || !nameKey) return null;

                    const phone = validatePhone(row[contactKey] || '');
                    return {
                        original: row,
                        nome: row[nameKey],
                        telefone: phone,
                        isValid: !!phone
                    };
                }).filter(item => item !== null);

                if (validData.length === 0) {
                    setError('Nenhum dado válido encontrado no arquivo.');
                    return;
                }

                try {
                    setIsSaving(true);
                    const { data: savedContacts, error: saveError } = await saveContacts(validData);
                    if (saveError) {
                        console.error('DB Save error:', saveError);
                        // Even if DB save fails, we continue with the parsed data
                        onDataLoaded(validData);
                    } else if (savedContacts) {
                        // Map the DB IDs back to our local validData
                        const enrichedData = validData.map(vd => {
                            const dbContact = savedContacts.find(sc => sc.phone === vd.telefone);
                            return {
                                ...vd,
                                id: dbContact?.id // Include the UUID from Supabase
                            };
                        });
                        setUploadSuccess(true);
                        setTimeout(() => {
                            onDataLoaded(enrichedData);
                        }, 800);
                    } else {
                        onDataLoaded(validData);
                    }
                } catch (err) {
                    onDataLoaded(validData);
                } finally {
                    setIsSaving(false);
                }
            },
            error: (err) => {
                setError('Falha ao processar: ' + err.message);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 text-slate-400 mb-2">
                <Info size={16} className="text-primary" />
                <p className="text-sm">Envie sua lista de contatos em formato CSV.</p>
            </div>

            <div
                className={`group relative glass-card rounded-2xl p-12 text-center transition-all duration-300 border-2 border-dashed
                    ${dragActive ? 'border-primary ring-4 ring-primary/20 bg-primary/5 scale-[1.02]' : 'border-white/10 hover:border-primary/40'}
                    ${error ? 'border-red-500/50 bg-red-500/5' : ''}
                    ${isSaving ? 'pointer-events-none opacity-80' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isSaving && document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    disabled={isSaving}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                />

                <div className="flex flex-col items-center space-y-6">
                    {/* Icon Sphere */}
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl
                        ${isSaving ? 'bg-primary animate-pulse rotate-45' :
                            uploadSuccess ? 'bg-green-500 scale-110' :
                                error ? 'bg-red-500' : 'bg-slate-800 group-hover:bg-primary group-hover:rotate-12'}
                    `}>
                        {isSaving ? (
                            <Loader2 size={36} className="text-white animate-spin" />
                        ) : uploadSuccess ? (
                            <CheckCircle size={36} className="text-white animate-bounce" />
                        ) : error ? (
                            <AlertCircle size={36} className="text-white" />
                        ) : (
                            <UploadIcon size={36} className="text-white group-hover:scale-110 transition-transform" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {isSaving ? 'Processando dados...' :
                                uploadSuccess ? 'Upload Concluído!' :
                                    error ? 'Ops! Algo deu errado' : 'Arraste seu arquivo CSV'}
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            {isSaving ? 'Organizando seus contatos no banco de dados...' :
                                uploadSuccess ? 'Redirecionando para visualização...' :
                                    error ? error : 'Ou clique para navegar em seus arquivos'}
                        </p>
                    </div>

                    {!error && !isSaving && !uploadSuccess && (
                        <div className="pt-4">
                            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-xs font-semibold text-slate-300">
                                <FileText size={14} className="text-primary" />
                                <span>Esperado: <span className="text-white">nome, contato</span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/10 rounded-tl-lg group-hover:border-primary/40 transition-colors" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/10 rounded-br-lg group-hover:border-primary/40 transition-colors" />
            </div>

            {/* Helper Alert */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3">
                <Info size={18} className="text-blue-400 mt-0.5" />
                <div className="text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Dica:</span> Seus contatos serão salvos automaticamente para que você possa acompanhá-los no Dashboard depois.
                </div>
            </div>
        </div>
    );
};

export default UploadSection;
