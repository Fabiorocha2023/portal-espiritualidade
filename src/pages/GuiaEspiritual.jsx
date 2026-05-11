import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX, Crown, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import { Badge } from '@/components/ui/badge';

export default function GuiaEspiritual() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Bem-vindo(a), alma viajante. 🌟 Sou seu Guia Espiritual, aqui para acolher e iluminar seu caminho de autoconhecimento e paz interior. Pode compartilhar o que estiver em seu coração — suas inquietações, reflexões do diário ou simplesmente como está se sentindo agora. Estou aqui por você.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechSynthesisRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'pt-BR';
            recognitionRef.current.onresult = (event) => { setInput(event.results[0][0].transcript); setIsRecording(false); };
            recognitionRef.current.onerror = () => setIsRecording(false);
            recognitionRef.current.onend = () => setIsRecording(false);
        }
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            if (window.speechSynthesis) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
            setInput('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR'; utterance.rate = 0.9; utterance.pitch = 1; utterance.volume = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            speechSynthesisRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => { if (window.speechSynthesis) { window.speechSynthesis.cancel(); setIsSpeaking(false); } };

    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';
    const trialStartDate = user?.trial_start_date ? new Date(user.trial_start_date) : new Date();
    const hoje = new Date();
    const diasDesdeTrial = Math.floor((hoje - trialStartDate) / (1000 * 60 * 60 * 24));
    const emPeriodoTrial = diasDesdeTrial <= 7;

    useEffect(() => {
        const resetCountersIfNeeded = async () => {
            if (!user) return;
            const thisMonth = format(new Date(), 'yyyy-MM');
            if (user.ai_last_reset_month !== thisMonth) {
                let updates = { ai_last_reset_month: thisMonth };
                if (isPremium) updates.creditos_mensais_ia = 18;
                if (isBasico) updates.creditos_mensais_ia = 1;
                await base44.auth.updateMe(updates);
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }
        };
        resetCountersIfNeeded();
    }, [user]);

    const calcularLimites = () => {
        if (!user) return { podeEnviar: false, motivoBloqueio: 'Carregando...' };

        // TRIAL / FREE - SEM acesso ao Guia Espiritual
        if (!isPremium && !isBasico) {
            return {
                podeEnviar: false,
                motivoBloqueio: emPeriodoTrial
                    ? 'O Guia Espiritual não está disponível no período de degustação gratuita.'
                    : 'Seu período de degustação expirou.',
                tipo: emPeriodoTrial ? 'trial_no_access' : 'trial_expired'
            };
        }

        // BÁSICO: 1 crédito/mês
        if (isBasico) {
            const creditos = user.creditos_mensais_ia || 0;
            if (creditos === 0) {
                return {
                    podeEnviar: false,
                    motivoBloqueio: 'Você já utilizou sua 1 interação mensal com o Guia Espiritual no plano Básico.',
                    tipo: 'basico_limit',
                };
            }
            return { podeEnviar: true, tipo: 'basico', creditos, isLastCredit: true };
        }

        // PREMIUM
        if (isPremium) {
            const creditosMensais = user.creditos_mensais_ia || 0;
            const creditosExtras = user.creditos_extras || 0;
            const totalCreditos = creditosMensais + creditosExtras;
            if (totalCreditos === 0) {
                return { podeEnviar: false, motivoBloqueio: 'Você usou todos os seus créditos de mensagem. Compre créditos extras para continuar!', tipo: 'no_credits', showExtras: true };
            }
            const isLastCredit = totalCreditos === 1;
            const showWarning = totalCreditos <= 5 && totalCreditos > 1;
            if (creditosMensais > 0) {
                return { podeEnviar: true, creditosMensais, creditosExtras, totalCreditos, tipo: 'premium_monthly', isLastCredit, showWarning };
            }
            if (creditosExtras > 0) {
                return { podeEnviar: true, usingExtras: true, creditosExtras, totalCreditos, tipo: 'premium_extras', isLastCredit, showWarning };
            }
        }

        return { podeEnviar: false, motivoBloqueio: 'Status desconhecido' };
    };

    const limiteInfo = calcularLimites();

    const chatMutation = useMutation({
        mutationFn: async (userMessage) => {
            const primeiroNome = user?.full_name ? user.full_name.split(' ')[0] : 'querido(a)';
            const perguntasGenericas = ['oi', 'olá', 'hey', 'tudo bem', 'ola', 'e ai', 'opa'];
            const isGeneric = perguntasGenericas.some(p => userMessage.toLowerCase().trim().includes(p) && userMessage.length < 30);

            const basePersonalidade = `Você é o 'Guia Espiritual' do app 'Portal da Espiritualidade'.
Sua personalidade é: extremamente acolhedora, sábia, não-julgadora, empática e levemente mística.
Seu objetivo é ajudar o usuário em sua jornada de autoconhecimento e paz interior.

REGRAS OBRIGATÓRIAS:
1. Sempre inicie sua resposta usando o primeiro nome do usuário: "${primeiroNome}".
2. Use linguagem simples e acessível, evite termos técnicos complicados.
3. Foque em conselhos práticos de presença, meditação e reflexão.
4. Se o usuário estiver ansioso ou estressado, ofereça uma técnica de respiração curta.
5. Não julgue, não critique — apenas acolha e oriente com sabedoria.
6. Se a mensagem parecer ser uma entrada de diário (relato pessoal extenso), leia o texto, identifique as emoções principais e forneça um feedback curto (máximo 2 parágrafos). Comece com o nome do usuário. Não tente resolver os problemas — ofereça uma perspectiva espiritual ou uma pergunta reflexiva baseada no que ele escreveu.`;

            let context;
            if (isGeneric) {
                context = `${basePersonalidade}

Responda de forma breve e acolhedora (1 parágrafo) à saudação do usuário.

Mensagem: ${userMessage}`;
            } else if (isBasico) {
                context = `${basePersonalidade}
Mantenha respostas em 2-3 parágrafos.

AO FINAL da resposta, adicione: "✨ Esta foi sua interação mensal com o Guia. Para conversas ilimitadas, conheça nosso plano Premium."

Histórico: ${messages.slice(-4).map(m => `${m.role === 'user' ? 'Usuário' : 'Guia'}: ${m.content}`).join('\n')}

Usuário: ${userMessage}

Responda como o Guia Espiritual:`;
            } else {
                context = `${basePersonalidade}
Mantenha respostas em 2-3 parágrafos.

Histórico: ${messages.slice(-6).map(m => `${m.role === 'user' ? 'Usuário' : 'Guia'}: ${m.content}`).join('\n')}

Usuário: ${userMessage}

Responda como o Guia Espiritual:`;
            }

            return await base44.integrations.Core.InvokeLLM({ prompt: context });
        },
        onSuccess: async (response, userMessage) => {
            setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: response }]);
            setInput('');
            if (autoSpeak) setTimeout(() => speakText(response), 500);

            if (user) {
                const today = format(new Date(), 'yyyy-MM-dd');
                let updates = {
                    ai_last_interaction_date: today,
                    ai_total_credits_consumed: (user.ai_total_credits_consumed || 0) + 1,
                    pontos_espirituais: (user.pontos_espirituais || 0) + 3
                };

                if (isBasico) {
                    updates.creditos_mensais_ia = Math.max(0, (user.creditos_mensais_ia || 0) - 1);
                }

                if (isPremium) {
                    const creditosMensais = user.creditos_mensais_ia || 0;
                    const creditosExtras = user.creditos_extras || 0;
                    const creditosIntegracaoMensais = user.creditos_integracao_mensais || 0;
                    const creditosIntegracaoExtras = user.creditos_integracao_extras || 0;

                    if (creditosMensais > 0) updates.creditos_mensais_ia = creditosMensais - 1;
                    else if (creditosExtras > 0) updates.creditos_extras = creditosExtras - 1;

                    const creditosIntegracaoUsados = 35;
                    if (creditosIntegracaoMensais >= creditosIntegracaoUsados) {
                        updates.creditos_integracao_mensais = creditosIntegracaoMensais - creditosIntegracaoUsados;
                    } else if (creditosIntegracaoMensais > 0) {
                        const restante = creditosIntegracaoUsados - creditosIntegracaoMensais;
                        updates.creditos_integracao_mensais = 0;
                        updates.creditos_integracao_extras = Math.max(0, creditosIntegracaoExtras - restante);
                    } else {
                        updates.creditos_integracao_extras = Math.max(0, creditosIntegracaoExtras - creditosIntegracaoUsados);
                    }
                    updates.total_integracao_consumed = (user.total_integracao_consumed || 0) + creditosIntegracaoUsados;
                }

                await base44.auth.updateMe(updates);
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }
        }
    });

    const handleSend = () => {
        if (!input.trim() || chatMutation.isPending || !limiteInfo.podeEnviar) return;
        stopSpeaking();
        chatMutation.mutate(input);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => {
        if (!limiteInfo.podeEnviar && user) setShowLimitModal(true);
        else setShowLimitModal(false);
    }, [limiteInfo.podeEnviar, user]);

    const temSuporteVoz = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

    return (
        <div className="h-screen flex flex-col p-6 pb-24">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full space-y-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
                    <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
                        <Sparkles className="w-8 h-8" />
                        Converse com seu Guia Espiritual
                    </h1>
                    {user && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {limiteInfo.tipo === 'basico' && (
                                <Badge className="bg-blue-600 text-white">Básico: {limiteInfo.creditos} interação disponível este mês</Badge>
                            )}
                            {limiteInfo.tipo === 'premium_monthly' && (
                                <>
                                    <Badge className={`${limiteInfo.showWarning ? 'bg-orange-600 animate-pulse' : limiteInfo.isLastCredit ? 'bg-red-600 animate-pulse' : 'bg-green-600'} text-white`}>
                                        {(limiteInfo.isLastCredit || limiteInfo.showWarning) && '⚠️ '}
                                        Créditos Mensais: {limiteInfo.creditosMensais}
                                        {limiteInfo.isLastCredit && ' - ÚLTIMO!'}
                                    </Badge>
                                    {limiteInfo.creditosExtras > 0 && <Badge className="bg-purple-600 text-white">Extras: {limiteInfo.creditosExtras}</Badge>}
                                </>
                            )}
                            {limiteInfo.tipo === 'premium_extras' && (
                                <Badge className={`${limiteInfo.isLastCredit ? 'bg-red-600' : 'bg-purple-600'} text-white animate-pulse`}>
                                    {limiteInfo.isLastCredit && '⚠️ '}
                                    Usando extra ({limiteInfo.creditosExtras} {limiteInfo.creditosExtras === 1 ? 'restante - ÚLTIMO!' : 'restantes'})
                                </Badge>
                            )}
                        </div>
                    )}
                </motion.div>

                {showLimitModal && !limiteInfo.podeEnviar && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 text-center shadow-xl">
                        <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-stone-800 mb-3">
                            {limiteInfo.tipo === 'trial_no_access' ? 'Guia Espiritual não disponível na degustação' :
                             limiteInfo.tipo === 'trial_expired' ? 'Período de Degustação Expirado' :
                             limiteInfo.tipo === 'basico_limit' ? 'Interação Mensal Utilizada' :
                             'Limite de Interações Atingido'}
                        </h2>
                        <p className="text-stone-700 mb-4">{limiteInfo.motivoBloqueio}</p>

                        {(limiteInfo.tipo === 'trial_no_access' || limiteInfo.tipo === 'trial_expired') ? (
                            <>
                                <p className="text-stone-600 mb-3">Escolha um plano para ter acesso ao Guia Espiritual:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-center">
                                        <p className="font-bold text-blue-800">Plano Básico</p>
                                        <p className="text-2xl font-bold text-blue-700">R$ 29,90/mês</p>
                                        <p className="text-sm text-blue-600">Tudo ilimitado + 1 interação/mês com o Guia</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-center">
                                        <p className="font-bold text-amber-800">Plano Premium</p>
                                        <p className="text-2xl font-bold text-amber-700">R$ 89,90/mês</p>
                                        <p className="text-sm text-amber-600">Tudo ilimitado + 18 interações/mês com o Guia</p>
                                    </div>
                                </div>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg px-8 py-4">
                                        <Crown className="w-5 h-5 mr-2" />
                                        Ver Planos de Assinatura
                                    </Button>
                                </Link>
                            </>
                        ) : limiteInfo.tipo === 'basico_limit' ? (
                            <>
                                <p className="text-stone-600 mb-4">Faça upgrade para o plano Premium e tenha <strong>18 interações mensais</strong> com o Guia Espiritual + créditos extras disponíveis!</p>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg px-8 py-4">
                                        <Crown className="w-5 h-5 mr-2" />
                                        Fazer Upgrade para Premium - R$ 89,90/mês
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link to={createPageUrl('ComprarExtras')}>
                                <Button className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg px-8 py-4">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Comprar Créditos Extras
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                )}

                {limiteInfo.podeEnviar && limiteInfo.isLastCredit && (
                    <Alert className="bg-gradient-to-r from-red-50 to-orange-50 border-red-400">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-900">
                            <strong>⚠️ Este é seu ÚLTIMO crédito disponível!</strong>
                            {limiteInfo.tipo === 'basico' && ' Após esta mensagem, você precisará aguardar o próximo mês ou fazer upgrade para Premium.'}
                            {limiteInfo.tipo === 'premium_monthly' && limiteInfo.creditosExtras === 0 && ' Após esta mensagem, você precisará comprar créditos extras para continuar.'}
                            {limiteInfo.tipo === 'premium_extras' && ' Compre mais créditos para não perder acesso!'}
                        </AlertDescription>
                    </Alert>
                )}

                {temSuporteVoz && (
                    <Alert className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                        <Volume2 className="w-4 h-4 text-purple-600" />
                        <AlertDescription className="text-purple-900 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-sm">🎤 Interação por voz ativada! Clique no microfone para falar ou digite sua mensagem.</span>
                            <Button variant="ghost" size="sm" onClick={() => setAutoSpeak(!autoSpeak)} className={autoSpeak ? 'text-purple-700' : 'text-stone-500'}>
                                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                <span className="ml-1 text-xs">{autoSpeak ? 'Áudio ON' : 'Áudio OFF'}</span>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="flex-1 overflow-hidden bg-white/80 backdrop-blur border-stone-200 shadow-lg flex flex-col">
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-gradient-to-br from-stone-100 to-stone-200 text-stone-800'}`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        {message.role === 'assistant' && temSuporteVoz && (
                                            <Button variant="ghost" size="sm" onClick={() => speakText(message.content)} className="mt-2 h-auto py-1 px-2 text-xs hover:bg-stone-300" disabled={isSpeaking}>
                                                <Volume2 className="w-3 h-3 mr-1" /> Ouvir resposta
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {chatMutation.isPending && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-gradient-to-br from-stone-100 to-stone-200 p-4 rounded-2xl">
                                    <Loader2 className="w-5 h-5 animate-spin text-stone-600" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>
                </Card>

                {limiteInfo.podeEnviar && (
                    <div className="space-y-2">
                        {isSpeaking && (
                            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                <Volume2 className="w-4 h-4 text-green-600 animate-pulse" />
                                <AlertDescription className="text-green-900 flex items-center justify-between">
                                    <span className="text-sm">🔊 Reproduzindo resposta do guia...</span>
                                    <Button variant="ghost" size="sm" onClick={stopSpeaking} className="text-green-700 hover:bg-green-100">Parar</Button>
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="flex gap-2">
                            {temSuporteVoz && (
                                <Button onClick={isRecording ? stopRecording : startRecording} disabled={chatMutation.isPending || isSpeaking}
                                    className={`${isRecording ? 'bg-gradient-to-br from-red-600 to-rose-600 animate-pulse' : 'bg-gradient-to-br from-purple-600 to-indigo-600'}`} size="lg">
                                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </Button>
                            )}
                            <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                                placeholder={isRecording ? "Ouvindo... fale agora" : "Compartilhe o que está em seu coração..."}
                                className="flex-1 resize-none bg-white/80 backdrop-blur border-stone-300" rows={2}
                                disabled={isRecording || chatMutation.isPending || isSpeaking} />
                            <Button onClick={handleSend} disabled={!input.trim() || chatMutation.isPending || isRecording || isSpeaking}
                                className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 self-end" size="lg">
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                        {isRecording && <p className="text-sm text-center text-purple-600 animate-pulse">🎤 Gravando... Fale agora</p>}
                    </div>
                )}
            </div>
        </div>
    );
}