import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Home, MessageCircle, Sparkles, BookOpen, BookMarked, User, Calendar, Upload, Menu, X, Trophy, LogOut, Users } from 'lucide-react';
import { createPageUrl } from './components/utils';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase, getCurrentUser } from '@/api/supabaseClient'

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => getCurrentUser(),
        initialData: null
    });

    const isAdmin = user?.role === 'admin';
    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';

    // Gate the app: redirecionar para Subscription apenas se trial expirou
    const trialStart = user?.trial_start_date ? new Date(user.trial_start_date) : new Date();
    const today = new Date();
    const diasDesdeTrial = Math.floor((today - trialStart) / (1000 * 60 * 60 * 24));
    const trialExpirado = diasDesdeTrial > 7;

    if (!isLoading && user && !isPremium && !isBasico && trialExpirado && currentPageName !== 'Subscription' && currentPageName !== 'Layout') {
        return <Navigate to={createPageUrl('Subscription')} replace />;
    }

    let navItems = [
        { name: 'Home', label: 'Início', icon: Home },
        { name: 'Recomendacoes', label: 'Recomendações deste Portal', icon: Sparkles },
        ...(isPremium || isBasico ? [] : [{ name: 'Desafio7Dias', label: 'Desafio 7 Dias', icon: Calendar }]),
        ...(isPremium || isBasico ? [{ name: 'GuiaEspiritual', label: 'Converse com seu Guia Espiritual', icon: MessageCircle }] : []),
        { name: 'Practices', label: 'Práticas', icon: Sparkles },
        { name: 'Sabedoria', label: 'Sabedoria', icon: BookOpen },
        { name: 'Diario', label: 'Diário', icon: BookMarked },
        { name: 'Comunidade', label: 'Círculo Sagrado', icon: Users },
        { name: 'Niveis', label: 'Níveis e Pontos', icon: Trophy },
        { name: 'Profile', label: 'Perfil', icon: User }
    ];

    // Adiciona item de compra de créditos para premium
    if (isPremium) {
        navItems.splice(navItems.findIndex(i => i.name === 'Niveis'), 0, { name: 'ComprarExtras', label: 'Comprar Créditos', icon: Sparkles });
    }

    // Adiciona item admin se for administrador
    if (isAdmin) {
        navItems.push({ name: 'AdminAudios', label: 'Admin Áudios', icon: Upload });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex">
            <style>{`
                :root {
                    --mystic-purple: #7C3AED;
                    --cosmic-gold: #F59E0B;
                    --deep-violet: #4C1D95;
                    --ethereal-blue: #818CF8;
                    --sacred-rose: #EC4899;
                    --starlight: #E0E7FF;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .nav-item-active {
                    color: var(--cosmic-gold);
                    background: linear-gradient(to right, rgba(245, 158, 11, 0.15), transparent);
                    border-left: 3px solid var(--cosmic-gold);
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, var(--mystic-purple), var(--cosmic-gold), var(--sacred-rose));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .mystic-glow {
                    box-shadow: 0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(245, 158, 11, 0.1);
                }
            `}</style>

            {/* Sidebar de Navegação - Desktop */}
            <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-950/95 to-purple-950/95 backdrop-blur-lg border-r border-purple-500/20 shadow-lg flex-col z-50 mystic-glow">
                <div className="p-6 border-b border-purple-500/20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text leading-tight">Portal da Espiritualidade</h1>
                            <p className="text-[10px] text-indigo-300/80 leading-tight mt-0.5">Um Guia Espiritual de bolso que te conhece pelo nome</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 py-6 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPageName === item.name;
                        return (
                            <Link
                                key={item.name}
                                to={createPageUrl(item.name)}
                                className={`flex items-center gap-3 px-6 py-4 transition-all ${
                                    isActive 
                                        ? 'nav-item-active text-amber-300 font-semibold' 
                                        : 'text-indigo-100 hover:text-amber-200 hover:bg-purple-800/30'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                
                <div className="p-6 border-t border-purple-500/20 space-y-3">
                    {!isPremium && (
                        <div className="bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-lg p-4 text-center border border-amber-500/30">
                            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <p className="text-xs text-indigo-50 mb-2">Desbloqueie todo potencial</p>
                            <Link to={createPageUrl('Subscription')}>
                                <button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white text-xs py-2 rounded-lg hover:from-amber-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30">
                                    Seja Premium - R$ 89,90
                                </button>
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={() => base44.auth.logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </nav>

            {/* Menu Mobile Hamburguer */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-950/95 to-purple-950/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg z-50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text leading-tight">Portal da Espiritualidade</h1>
                            <p className="text-[9px] text-indigo-300/80 leading-tight">Um Guia Espiritual de bolso que te conhece pelo nome</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-indigo-200 hover:text-amber-300 hover:bg-purple-800/30"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Menu Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed top-[57px] left-0 right-0 bottom-0 bg-gradient-to-b from-indigo-950/98 to-purple-950/98 backdrop-blur-lg z-40 overflow-y-auto">
                    <div className="py-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPageName === item.name;
                            return (
                                <Link
                                    key={item.name}
                                    to={createPageUrl(item.name)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-6 py-4 transition-all ${
                                        isActive 
                                            ? 'bg-purple-800/40 text-amber-300 font-semibold border-l-4 border-amber-500' 
                                            : 'text-indigo-50 hover:bg-purple-800/30 hover:text-amber-200'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="px-6 py-4 space-y-3">
                            {!isPremium && (
                                <div className="bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-lg p-4 text-center border border-amber-500/30">
                                        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                        <p className="text-xs text-indigo-50 mb-2">Desbloqueie todo potencial</p>
                                    <Link to={createPageUrl('Subscription')}>
                                        <button 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white text-sm py-2 rounded-lg hover:from-amber-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30"
                                        >
                                            Seja Premium - R$ 89,90
                                        </button>
                                    </Link>
                                </div>
                            )}
                            <button
                                onClick={() => base44.auth.logout()}
                                className="w-full flex items-center gap-2 px-3 py-3 rounded-lg text-indigo-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo Principal */}
            <main className="flex-1 lg:ml-64 pt-[57px] lg:pt-0 overflow-x-hidden w-full">
                {children}
            </main>
        </div>
    );
}