import React from 'react';
import { LayoutDashboard, Send, Settings, Bell, CircleUser, Menu } from 'lucide-react';

const Layout = ({ children, currentView, onViewChange }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="flex min-h-screen">
                {/* Sidebar - Hidden on mobile, visible on desktop */}
                <aside className="hidden md:flex flex-col w-64 glass border-r border-white/5 sticky top-0 h-screen">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic tracking-tight">
                            AttoDisparo
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {[
                            { id: 'home', label: 'Nova Campanha', icon: Send },
                            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onViewChange && onViewChange(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${currentView === item.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <item.icon size={20} className={currentView === item.id ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/5 space-y-1">
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
                            <Settings size={18} />
                            <span>Configurações</span>
                        </button>
                        <div className="px-4 py-4 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-xs font-bold">
                                YS
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Yuri Souza</p>
                                <p className="text-xs text-slate-500 truncate">Admin</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
                        <div className="flex items-center md:hidden">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                <Menu size={24} />
                            </button>
                            <h1 className="ml-2 text-lg font-bold text-white">AttoDisparo</h1>
                        </div>

                        <div className="hidden md:flex items-center text-sm text-slate-400">
                            Dashboard / <span className="text-white ml-2 font-medium capitalize">{currentView}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                            </button>
                            <div className="h-8 w-[1px] bg-white/10" />
                            <div className="flex items-center space-x-2 cursor-pointer group">
                                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Yuri Souza</span>
                                <CircleUser size={24} className="text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>

                    {/* Footer - Minimalist */}
                    <footer className="py-6 px-8 text-center text-xs text-slate-600 border-t border-white/5">
                        <p>&copy; {new Date().getFullYear()} ATTO Corp DISPARO. v1.2.0 • Premium Edition</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Layout;
