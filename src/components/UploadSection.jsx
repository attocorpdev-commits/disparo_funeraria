import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload as UploadIcon, FileText, X, AlertCircle } from 'lucide-react';
import { isValidCSVHeader, validatePhone } from '../utils/validators';

const UploadSection = ({ onDataLoaded }) => {
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

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
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Por favor, envie apenas arquivos CSV.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError('Erro ao ler o arquivo CSV. Verifique o formato.');
                    console.error(results.errors);
                    return;
                }

                const headers = results.meta.fields;
                if (!isValidCSVHeader(headers)) {
                    setError('O arquivo CSV deve conter as colunas: "nome" e "contato".');
                    return;
                }

                // Validate and format data
                const validData = results.data.map(row => {
                    // Find the key that corresponds to 'contato' (case insensitive)
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

                onDataLoaded(validData);
            },
            error: (err) => {
                setError('Falha ao processar o arquivo: ' + err.message);
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

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-primary bg-blue-50' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center space-y-4">
                    <div className={`p-4 rounded-full ${error ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-primary'}`}>
                        {error ? <AlertCircle size={32} /> : <UploadIcon size={32} />}
                    </div>
                    <div>
                        <p className="text-lg font-medium text-slate-700">
                            {error ? 'Erro no Upload' : 'Arraste seu arquivo CSV aqui'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            ou clique para selecionar do computador
                        </p>
                    </div>
                    {!error && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded">
                            <FileText size={14} />
                            <span>Colunas obrigatórias: nome, contato</span>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
                    <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default UploadSection;
