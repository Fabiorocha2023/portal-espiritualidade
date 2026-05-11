import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles, Check, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import { createStripeCheckoutSession } from '@/functions/createStripeCheckoutSession';

export default function ComprarExtras() {
    const [loading, setLoading] = useState(null);

    const queryClient = useQueryClient();
    
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });
    
    // Migration automática: inicializar créditos de integração para usuários premium
    useEffect(() => {
        const migrateCreditosIntegracao = async () => {
            if (!user || user.tipo_assinatura !== 'premium') return;
            
            // Verificar se já tem créditos de integração configurados
            if (user.creditos_integracao_mensais !== undefined && user.creditos_integracao_mensais !== null) return;
            
            // Calcular créditos de integração baseado nos créditos de mensagem
            const creditosMensais = user.creditos_mensais_ia || 0;
            const creditosExtras = user.creditos_extras || 0;
            
            const updates = {
                creditos_integracao_mensais: creditosMensais * 40,
                creditos_integracao_extras: creditosExtras * 40
            };
            
            await base44.auth.updateMe(updates);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        };
        
        migrateCreditosIntegracao();
    }, [user, queryClient]);

    const isPremium = user?.tipo_assinatura === 'premium';

    const pacotes = [
        {
            nome: 'Pacote Básico',
            creditos: 8,
            preco: 20.00,
            priceId: 'price_1T4qsV1kul1So0t8hA5spwBD',
            popular: false
        },
        {
            nome: 'Pacote Plus',
            creditos: 16,
            preco: 40.00,
            priceId: 'price_1T4qtW1kul1So0t83GKbzJRO',
            popular: true
        },
        {
            nome: 'Pacote Premium',
            creditos: 24,
            preco: 60.00,
            priceId: 'price_1T4quR1kul1So0t8H4VZJkmy',
            popular: false
        }
    ];

    const handleComprar = async (priceId, pacoteNome) => {
        setLoading(priceId);

        try {
            if (window.self !== window.top) {
                alert('O checkout do Stripe só funciona em aplicativos publicados, não na prévia. Publique o aplicativo para testar pagamentos reais.');
                setLoading(null);
                return;
            }

            const response = await createStripeCheckoutSession({ 
                priceId: priceId, 
                mode: 'payment' 
            });

            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('URL de checkout não recebida');
            }
        } catch (error) {
            console.error('Erro ao criar sessão de checkout:', error);
            alert('Erro ao processar pagamento. Por favor, tente novamente.');
            setLoading(null);
        }
    };

    if (!isPremium) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
                <Card className="max-w-md w-full bg-white/95 backdrop-blur-xl border-purple-500/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-indigo-900">Apenas para Assinantes Premium</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-indigo-600">
                            A compra de créditos extras está disponível apenas para assinantes premium.
                        </p>
                        <p className="text-indigo-500 text-sm">
                            Faça upgrade para premium e ganhe 18 créditos mensais + a possibilidade de comprar pacotes extras quando precisar!
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to={createPageUrl('Subscription')} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white">
                                Assinar Premium - R$ 89,90/mês
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4"
                    >
                        <Zap className="w-5 h-5 text-amber-300" />
                        <span className="text-amber-200 font-semibold">Créditos Extras</span>
                    </motion.div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Compre Créditos para o Guia Espiritual
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Seus créditos mensais acabaram? Compre pacotes extras e continue sua jornada espiritual sem interrupções.
                    </p>

                    {/* Créditos Atuais com Barra de Progresso */}
                    <Card className="mt-8 max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border-purple-500/20 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                    <h3 className="text-xl font-bold text-indigo-900">Seus Créditos de Mensagem</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-purple-600">
                                        {(user?.creditos_mensais_ia || 0) + (user?.creditos_extras || 0)}
                                    </div>
                                    <div className="text-xs text-indigo-500">créditos disponíveis</div>
                                </div>
                            </div>

                            {/* Barra de Progresso - Créditos Mensais */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold text-indigo-700">Créditos Mensais</span>
                                        <span className="text-sm text-indigo-600">{user?.creditos_mensais_ia || 0} / 18</span>
                                    </div>
                                    <div className="w-full bg-indigo-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(((user?.creditos_mensais_ia || 0) / 18) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-indigo-500 mt-1">Renovam todo mês com sua assinatura</p>
                                </div>

                                {/* Barra de Progresso - Créditos Extras */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold text-amber-700">Créditos Extras</span>
                                        <span className="text-sm text-amber-600">{user?.creditos_extras || 0}</span>
                                    </div>
                                    <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: user?.creditos_extras > 0 ? `${Math.min((user.creditos_extras / 150) * 100, 100)}%` : '0%' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-1">Nunca expiram - comprados separadamente</p>
                                </div>
                            </div>

                            {/* Alerta de créditos baixos */}
                            {((user?.creditos_mensais_ia || 0) + (user?.creditos_extras || 0)) < 5 && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700 font-medium">
                                        ⚠️ Seus créditos estão acabando! Compre mais para continuar usando o Guia Espiritual.
                                    </p>
                                </div>
                            )}
                            </CardContent>
                            </Card>

                            {/* Créditos de Integração */}
                            <Card className="mt-6 max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border-green-500/20 shadow-xl">
                            <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-green-500" />
                                    <h3 className="text-xl font-bold text-green-900">Créditos de Integração</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600">
                                        {(user?.creditos_integracao_mensais || 0) + (user?.creditos_integracao_extras || 0)}
                                    </div>
                                    <div className="text-xs text-green-500">créditos disponíveis</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Barra de Progresso - Créditos Mensais de Integração */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold text-green-700">Integração Mensais</span>
                                        <span className="text-sm text-green-600">{user?.creditos_integracao_mensais || 0} / 720</span>
                                    </div>
                                    <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(((user?.creditos_integracao_mensais || 0) / 720) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-green-500 mt-1">720 créditos mensais (18 × 40)</p>
                                </div>

                                {/* Barra de Progresso - Créditos Extras de Integração */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold text-teal-700">Integração Extras</span>
                                        <span className="text-sm text-teal-600">{user?.creditos_integracao_extras || 0}</span>
                                    </div>
                                    <div className="w-full bg-teal-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: user?.creditos_integracao_extras > 0 ? `${Math.min((user.creditos_integracao_extras / 1000) * 100, 100)}%` : '0%' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-teal-600 mt-1">Comprados com pacotes de mensagem</p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs text-green-700">
                                    💡 <strong>Importante:</strong> Créditos de integração são usados automaticamente quando você interage com o Guia Espiritual (IA). Cada 1 crédito de mensagem inclui 40 créditos de integração.
                                </p>
                            </div>
                            </CardContent>
                            </Card>
                </div>

                {/* Pacotes */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {pacotes.map((pacote, index) => (
                        <motion.div
                            key={pacote.priceId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`relative overflow-hidden ${
                                pacote.popular 
                                    ? 'bg-gradient-to-br from-amber-50 to-purple-50 border-2 border-amber-400 shadow-2xl shadow-amber-500/20' 
                                    : 'bg-white/95 backdrop-blur-xl border-purple-500/20'
                            }`}>
                                {pacote.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                                        MAIS POPULAR
                                    </div>
                                )}
                                
                                <CardHeader className="text-center pb-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                        pacote.popular 
                                            ? 'bg-gradient-to-br from-amber-400 to-purple-600' 
                                            : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                                    }`}>
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl text-indigo-900">{pacote.nome}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-5xl font-bold text-indigo-900">
                                            {pacote.creditos}
                                        </span>
                                        <span className="text-indigo-600 ml-2">créditos</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-purple-600">
                                            R$ {pacote.preco.toFixed(2).replace('.', ',')}
                                        </span>
                                        <p className="text-indigo-500 text-sm mt-1">Pagamento único</p>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-indigo-100">
                                        {[
                                            'Créditos nunca expiram',
                                            'Use quando quiser',
                                            'Válido para IA do Guia',
                                            'Pagamento único e seguro'
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span className="text-indigo-700 text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => handleComprar(pacote.priceId, pacote.nome)}
                                        disabled={loading === pacote.priceId}
                                        className={`w-full h-12 font-bold text-lg ${
                                            pacote.popular
                                                ? 'bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700'
                                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                                        } text-white shadow-lg`}
                                    >
                                        {loading === pacote.priceId ? (
                                            'Processando...'
                                        ) : (
                                            <>
                                                Comprar Agora
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Info Section */}
                <Card className="bg-white/95 backdrop-blur-xl border-purple-500/20 shadow-xl">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-indigo-900 mb-4">Como funcionam os créditos?</h3>
                        <div className="space-y-3 text-indigo-700">
                            <p>• <strong>Créditos de Mensagem:</strong> Cada conversa com o Guia Espiritual consome 1 crédito</p>
                            <p>• <strong>Créditos de Integração:</strong> Usados automaticamente pelas funcionalidades com IA. Cada 1 crédito de mensagem inclui 40 de integração</p>
                            <p>• <strong>Mensais:</strong> 18 créditos de mensagem + 720 de integração, renovam todo mês</p>
                            <p>• <strong>Extras:</strong> Nunca expiram e podem ser comprados a qualquer momento</p>
                            <p>• <strong>Prioridade:</strong> Créditos mensais são usados primeiro, depois os extras</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}