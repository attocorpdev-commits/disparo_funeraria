import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-primary text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* Placeholder for Logo if needed */}
                        <h1 className="text-xl font-semibold tracking-wide">Sistema de Disparo</h1>
                    </div>
                    <nav>
                        {/* Future navigation items can go here */}
                        <span className="text-sm text-slate-300">v1.0.0</span>
                    </nav>
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
