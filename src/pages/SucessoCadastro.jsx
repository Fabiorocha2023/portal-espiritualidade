import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { verifyStripePayment } from '@/functions/verifyStripePayment';
import { base44 } from '@/api/base44Client';

export default function SucessoCadastro() {
    const [status, setStatus] = useState('loading'); // loading | success | error | no_session
    const [customerEmail, setCustomerEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
            setStatus('no_session');
            return;
        }

        const verify = async () => {
            try {
                const res = await verifyStripePayment({ session_id: sessionId });
                const data = res.data;

                if (data.success) {
                    setCustomerEmail(data.customer_email || '');
                    setStatus('success');

                    // Verifica se o usuário já está logado
                    const authOk = await base44.auth.isAuthenticated();
                    setIsAuthenticated(authOk);
                } else {
                    setStatus('error');
                }
            } catch (e) {
                setStatus('error');
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex items-center justify-center p-4">
            {/* Partículas decorativas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-amber-400/30 animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Portal da Espiritualidade</h1>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center shadow-2xl">

                    {/* Loading */}
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <Loader2 className="w-16 h-16 text-amber-400 animate-spin mx-auto" />
                            <h2 className="text-2xl font-bold text-white">Verificando seu pagamento...</h2>
                            <p className="text-indigo-200">Aguarde um momento enquanto confirmamos sua assinatura.</p>
                        </div>
                    )}

                    {/* Sucesso */}
                    {status === 'success' && (
                        <div className="space-y-5">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado! ✨</h2>
                                <p className="text-indigo-200 text-sm">
                                    Bem-vindo(a) ao Portal da Espiritualidade Premium!
                                </p>
                                {customerEmail && (
                                    <p className="text-amber-300 text-sm mt-1 font-medium">{customerEmail}</p>
                                )}
                            </div>

                            <div className="bg-purple-800/40 rounded-xl p-4 text-left space-y-2 border border-purple-500/30">
                                <p className="text-white font-semibold text-sm mb-3">Você desbloqueou:</p>
                                {['18 créditos mensais com o Guia Espiritual', 'Acesso a todas as práticas premium', 'Biblioteca completa de sabedoria', 'Desafios exclusivos e muito mais'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                        <span className="text-indigo-100 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {isAuthenticated ? (
                                <Link to={createPageUrl('Home')} className="block">
                                    <button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-amber-400 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2">
                                        Acessar o Portal <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-indigo-200 text-sm">
                                        Agora crie sua conta para acessar o Portal com todos os benefícios premium já ativados.
                                    </p>
                                    <button
                                        onClick={() => base44.auth.redirectToLogin(createPageUrl('Home'))}
                                        className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-amber-400 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Criar minha conta <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sem session_id */}
                    {status === 'no_session' && (
                        <div className="space-y-4">
                            <Sparkles className="w-16 h-16 text-amber-400 mx-auto" />
                            <h2 className="text-2xl font-bold text-white">Portal da Espiritualidade Premium</h2>
                            <p className="text-indigo-200">
                                Para assinar e ter acesso completo ao portal, clique no botão abaixo.
                            </p>
                            <Link to={createPageUrl('Subscription')} className="block">
                                <button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-amber-400 hover:to-purple-500 transition-all shadow-lg">
                                    Ver planos
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Erro */}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center mx-auto">
                                <XCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Não foi possível confirmar</h2>
                            <p className="text-indigo-200 text-sm">
                                Não conseguimos verificar seu pagamento. Se você foi cobrado, entre em contato com nosso suporte.
                            </p>
                            <Link to={createPageUrl('Subscription')} className="block">
                                <button className="w-full bg-white/10 border border-purple-400/40 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all">
                                    Tentar novamente
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-indigo-400 text-xs mt-6">
                    Portal da Espiritualidade © {new Date().getFullYear()} — Todos os direitos reservados
                </p>
            </div>
        </div>
    );
}