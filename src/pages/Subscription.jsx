import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, Shield, CreditCard, Star, Calendar, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import { format, addDays } from 'date-fns';
import { createStripeCheckoutSession } from '@/functions/createStripeCheckoutSession';

// IDs dos planos no Stripe
const PRICE_BASICO        = 'price_1TD3VO1kul1So0t8kNKppACe';  // R$29,90/mês
const PRICE_PREMIUM       = 'price_1T4qqs1kul1So0t8fmkBkmBc';  // R$89,90/mês
const PRICE_BASICO_ANUAL  = 'price_1TE7Vw1kul1So0t8WzV2nlel';  // R$299,90/ano
const PRICE_PREMIUM_ANUAL = 'price_1TE7We1kul1So0t8wxxx5iHb'; // R$899,90/ano

export default function Subscription() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const [ciclo, setCiclo] = useState(urlParams.get('ciclo') === 'anual' ? 'anual' : 'mensal');
    
    // Form states
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const handleSubscribe = async (planoPreco, priceId) => {
        if (!name) {
            alert('Por favor, preencha seu nome.');
            return;
        }

        setLoading(true);

        try {
            if (window.self !== window.top) {
                alert('O checkout do Stripe só funciona em aplicativos publicados, não na prévia. Publique o aplicativo para testar pagamentos reais.');
                setLoading(false);
                return;
            }

            const response = await createStripeCheckoutSession({ 
                priceId: priceId, 
                mode: 'subscription' 
            });

            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('URL de checkout não recebida');
            }
        } catch (error) {
            console.error('Erro ao criar sessão de checkout:', error);
            alert('Erro ao processar pagamento. Por favor, tente novamente.');
            setLoading(false);
        }
    };

    // Format helpers
    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(val.slice(0, 19));
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
        setExpiry(val.slice(0, 5));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 z-10"
            >
                {/* Left Side: Value Prop */}
                <div className="text-white space-y-8 p-6 flex flex-col justify-center">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center">
                                <Star className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span className="font-bold tracking-wider text-amber-300">PORTAL PREMIUM</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            Comece sua jornada de <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300">
                                transformação espiritual
                            </span>
                        </h1>
                        <p className="text-indigo-200 text-lg">
                            Experimente tudo gratuitamente por 7 dias. Cancele a qualquer momento.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Acesso ilimitado a práticas, sabedoria e diário",
                            "18 créditos mensais para conversar com o Guia Espiritual (IA)",
                            "Jornada personalizada e desafios exclusivos",
                            "Possibilidade de comprar créditos extras para o Guia"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-amber-300" />
                                </div>
                                <span className="text-indigo-100">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-sm text-indigo-300/60">
                        <Shield className="w-4 h-4" />
                        <span>Pagamento seguro e criptografado</span>
                    </div>
                </div>

                {/* Right Side: Planos */}
                <div className="space-y-4">
                    {/* Toggle mensal/anual */}
                    <div className="flex items-center justify-center gap-2 bg-white/10 rounded-full p-1">
                        <button
                            onClick={() => setCiclo('mensal')}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                                ciclo === 'mensal' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200'
                            }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setCiclo('anual')}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                                ciclo === 'anual' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200'
                            }`}
                        >
                            Anual 🏷️ Economize
                        </button>
                    </div>

                    {ciclo === 'mensal' ? (
                        <>
                            {/* Plano Básico Mensal */}
                            <Card className="bg-white/95 backdrop-blur-xl border-blue-300 shadow-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-indigo-900 text-lg">Plano Básico</CardTitle>
                                            <p className="text-indigo-600 text-sm mt-1">Tudo ilimitado + 1 interação/mês com o Guia</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-700">R$ 29,90</p>
                                            <p className="text-xs text-blue-500">/mês</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-2 mb-4">
                                        {['Práticas espirituais ilimitadas', 'Biblioteca de sabedoria ilimitada', 'Diário ilimitado', 'Desafio 7 dias', '1 interação/mês com o Guia Espiritual (IA)'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-blue-600" /></div>
                                                <span className="text-indigo-700 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <Label className="text-indigo-900">Seu nome</Label>
                                        <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} className="border-blue-200" />
                                    </div>
                                    <Button onClick={() => handleSubscribe('R$29,90', PRICE_BASICO)} disabled={loading || !name} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold">
                                        {loading ? 'Processando...' : 'Assinar Plano Básico'}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Plano Premium Mensal */}
                            <Card className="bg-white/95 backdrop-blur-xl border-amber-400 shadow-2xl overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-purple-600 text-white text-xs font-bold px-4 py-1 text-center">MAIS COMPLETO • 7 DIAS GRÁTIS</div>
                                <CardHeader className="bg-gradient-to-r from-amber-50 to-purple-50 border-b border-amber-100 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-indigo-900 text-lg">Plano Premium</CardTitle>
                                            <p className="text-indigo-600 text-sm mt-1">Tudo + 18 interações/mês com o Guia IA</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-amber-700">R$ 89,90</p>
                                            <p className="text-xs text-amber-500">/mês</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-2 mb-4">
                                        {['Tudo do plano Básico', '18 interações/mês com o Guia Espiritual (IA)', 'Pacotes de créditos extras disponíveis', '7 dias de teste grátis'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-amber-600" /></div>
                                                <span className="text-indigo-700 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <Label className="text-indigo-900">Seu nome</Label>
                                        <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} className="border-amber-200" />
                                    </div>
                                    <Button onClick={() => handleSubscribe('R$89,90', PRICE_PREMIUM)} disabled={loading || !name} className="w-full h-11 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-500/20">
                                        {loading ? 'Processando...' : 'Começar 7 Dias Grátis'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            {/* Plano Básico Anual */}
                            <Card className="bg-white/95 backdrop-blur-xl border-blue-300 shadow-2xl overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-4 py-1 text-center">💰 EQUIVALE A R$24,99/MÊS — ECONOMIZE R$59/ANO</div>
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-indigo-900 text-lg">Básico Anual</CardTitle>
                                            <p className="text-indigo-600 text-sm mt-1">1 interação/mês com o Guia + tudo ilimitado</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-700">R$ 299,90</p>
                                            <p className="text-xs text-blue-500">/ano</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-2 mb-4">
                                        {['Práticas espirituais ilimitadas', 'Biblioteca de sabedoria ilimitada', 'Diário ilimitado', 'Desafio 7 dias', '1 interação/mês com o Guia Espiritual (IA)', 'Cobrança única anual'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-blue-600" /></div>
                                                <span className="text-indigo-700 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <Label className="text-indigo-900">Seu nome</Label>
                                        <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} className="border-blue-200" />
                                    </div>
                                    <Button onClick={() => handleSubscribe('R$299,90', PRICE_BASICO_ANUAL)} disabled={loading || !name} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold">
                                        {loading ? 'Processando...' : 'Assinar Básico Anual'}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Plano Premium Anual */}
                            <Card className="bg-white/95 backdrop-blur-xl border-amber-400 shadow-2xl overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-purple-600 text-white text-xs font-bold px-4 py-1 text-center">⭐ MELHOR VALOR • ECONOMIZE R$179/ANO</div>
                                <CardHeader className="bg-gradient-to-r from-amber-50 to-purple-50 border-b border-amber-100 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-indigo-900 text-lg">Premium Anual</CardTitle>
                                            <p className="text-indigo-600 text-sm mt-1">Equivale a R$74,99/mês • 18 interações/mês</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-amber-700">R$ 899,90</p>
                                            <p className="text-xs text-amber-500">/ano</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-2 mb-4">
                                        {['Tudo do plano Básico Anual', '18 interações/mês com o Guia Espiritual (IA)', 'Pacotes de créditos extras disponíveis', 'Cobrança única anual'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-amber-600" /></div>
                                                <span className="text-indigo-700 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <Label className="text-indigo-900">Seu nome</Label>
                                        <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} className="border-amber-200" />
                                    </div>
                                    <Button onClick={() => handleSubscribe('R$899,90', PRICE_PREMIUM_ANUAL)} disabled={loading || !name} className="w-full h-11 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-500/20">
                                        {loading ? 'Processando...' : 'Assinar Premium Anual'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <p className="text-xs text-white/60 text-center">
                        Pagamento seguro via Stripe. Cancele quando quiser.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function UserIcon({ className }) {
    return (
        <svg 
            className={className} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}