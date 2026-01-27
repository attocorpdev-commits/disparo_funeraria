import React from 'react';

const Layout = ({ children, currentView, onViewChange }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-primary text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        {/* Placeholder for Logo if needed */}
                        <h1 className="text-xl font-semibold tracking-wide flex items-center">
                            Sistema de Disparo
                        </h1>
                        <nav className="hidden md:flex space-x-1">
                            <button
                                onClick={() => onViewChange && onViewChange('home')}
                                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium
                  ${currentView === 'home'
                                        ? 'bg-white/10 text-white'
                                        : 'text-primary-foreground/80 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                Nova Campanha
                            </button>
                            <button
                                onClick={() => onViewChange && onViewChange('dashboard')}
                                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium
                  ${currentView === 'dashboard'
                                        ? 'bg-white/10 text-white'
                                        : 'text-primary-foreground/80 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                Dashboard
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-white/60">v1.1.0</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-slate-800 text-slate-400 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Sistema de Mensagens Funerárias. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
