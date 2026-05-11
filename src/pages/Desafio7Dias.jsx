import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, Calendar, Sparkles, ArrowRight, Crown, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioPlayer from '../components/AudioPlayer';
import { format, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';

export default function Desafio7Dias() {
    const [diaAberto, setDiaAberto] = useState(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const { data: challenges } = useQuery({
        queryKey: ['challenges'],
        queryFn: () => base44.entities.Challenge.list(),
        initialData: []
    });

    const { data: userProgress } = useQuery({
        queryKey: ['userProgress', user?.email],
        queryFn: () => base44.entities.UserProgress.filter({ created_by: user?.email }),
        initialData: [],
        enabled: !!user
    });

    const createProgressMutation = useMutation({
        mutationFn: (data) => base44.entities.UserProgress.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProgress'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }
    });

    const updateProgressMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.UserProgress.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProgress'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }
    });

    const desafio7Dias = challenges.find(c => c.duracao_dias === 7) || null;
    const progresso = userProgress.find(p => p.challenge_id === desafio7Dias?.id);

    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';
    const isAssinante = isPremium || isBasico;

    // Verificar período de trial
    const trialStart = user?.trial_start_date ? new Date(user.trial_start_date) : new Date();
    const hoje = new Date();
    const diasDesdeTrial = Math.floor((hoje - trialStart) / (1000 * 60 * 60 * 24));
    const emPeriodoTeste = diasDesdeTrial <= 7;

    const podeIniciar = isAssinante || emPeriodoTeste;

    // Verificar se pode acessar
    React.useEffect(() => {
        if (!isPremium && hasStarted && !progresso && emPeriodoTeste) {
            setShowLimitModal(true);
        }
    }, [isPremium, hasStarted, progresso, emPeriodoTeste]);

    const iniciarDesafio = async () => {
        if (desafio7Dias && !progresso) {
            createProgressMutation.mutate({
                challenge_id: desafio7Dias.id,
                dia_atual: 1,
                dias_completados: [],
                data_inicio: format(new Date(), 'yyyy-MM-dd'),
                completado: false
            });
        }
    };

    const completarDia = async (numeroDia) => {
        if (!progresso) return;

        const novosDiasCompletados = [...(progresso.dias_completados || []), numeroDia];
        const proximoDia = numeroDia + 1;
        const desafioCompleto = numeroDia === 7;

        await updateProgressMutation.mutateAsync({
            id: progresso.id,
            data: {
                dias_completados: novosDiasCompletados,
                dia_atual: proximoDia,
                completado: desafioCompleto
            }
        });

        if (user) {
            await base44.auth.updateMe({
                pontos_espirituais: (user.pontos_espirituais || 0) + 15,
                dias_consecutivos: (user.dias_consecutivos || 0) + 1
            });
        }

        setDiaAberto(null);
    };

    const diasDesdeInicioProgresso = progresso?.data_inicio 
        ? differenceInDays(new Date(), new Date(progresso.data_inicio))
        : 0;

    if (!desafio7Dias) {
        return (
            <div className="min-h-screen p-6 pb-24 md:pb-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-stone-600">Carregando desafio...</p>
                </div>
            </div>
        );
    }

    if (diaAberto) {
        const diaAtual = desafio7Dias.dias.find(d => d.dia === diaAberto);
        const diaCompletado = progresso?.dias_completados?.includes(diaAberto);
        
        // Regra: Dias 3+ bloqueados para não-premium
        const diaBloqueado = !isPremium && diaAberto >= 3;

        return (
            <div className="min-h-screen p-6 pb-24 md:pb-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => setDiaAberto(null)}
                        className="mb-4 text-white hover:text-amber-300 hover:bg-purple-800/30"
                    >
                        Voltar
                    </Button>

                    <Card className="bg-white/90 backdrop-blur border-stone-200 shadow-xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Badge className="bg-amber-100 text-amber-800">
                                    Dia {diaAtual.dia} de 7
                                </Badge>
                                {diaCompletado && (
                                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Completado
                                    </Badge>
                                )}
                                {diaBloqueado && (
                                    <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Premium
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-3xl mt-4">
                                {diaAtual.titulo}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {diaBloqueado ? (
                                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 shadow-lg">
                                    <CardContent className="p-8 text-center space-y-4">
                                        <Crown className="w-16 h-16 text-purple-600 mx-auto" />
                                        <h2 className="text-2xl font-bold text-purple-900">
                                            Você alcançou o Portal da Consistência!
                                        </h2>
                                        <p className="text-purple-800 text-lg leading-relaxed">
                                            Os próximos 5 dias deste desafio, que incluem <strong>práticas avançadas de transformação profunda e meditações guiadas exclusivas</strong>, são exclusivos para nossos membros assinantes.
                                        </p>
                                        <p className="text-purple-700 font-semibold">
                                            Sua evolução merece esse compromisso.
                                        </p>
                                        <Link to={createPageUrl('Subscription')}>
                                                                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6 px-8 mt-4">
                                                                                <Crown className="w-5 h-5 mr-2" />
                                                                                Ver Planos a partir de R$ 29,90/mês
                                                                            </Button>
                                                                        </Link>
                                                                        <p className="text-sm text-purple-600 mt-2">
                                                                            ✨ Cancele quando quiser
                                                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                            {diaAtual.audio_texto && (
                                <AudioPlayer 
                                    texto={diaAtual.audio_texto}
                                    titulo={diaAtual.titulo}
                                />
                            )}

                            <div className="prose prose-stone max-w-none">
                                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-lg">
                                    {diaAtual.conteudo}
                                </p>
                            </div>

                            {diaAtual.pratica && (
                                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Prática do Dia
                                        </h3>
                                        <p className="text-purple-800 whitespace-pre-wrap">
                                            {diaAtual.pratica}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {!diaCompletado && (
                                <Button
                                    onClick={() => completarDia(diaAberto)}
                                    disabled={updateProgressMutation.isPending}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6"
                                >
                                    {updateProgressMutation.isPending ? 'Salvando...' : 'Completar Dia'}
                                </Button>
                            )}
                            </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pb-24 md:pb-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Desafio de 7 Dias
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        {desafio7Dias.descricao}
                    </p>
                    {!isAssinante && emPeriodoTeste && (
                        <p className="text-sm text-amber-300 font-semibold">
                            ✨ Período de degustação — Acesso liberado!
                        </p>
                    )}
                </motion.div>

                {false && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 text-center shadow-xl"
                    >
                        <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-stone-800 mb-3">
                            Limite de Teste Atingido
                        </h2>
                        <p className="text-stone-700 mb-4">
                            Você já iniciou seu desafio único durante o período de teste.
                        </p>
                        <p className="text-stone-600 mb-6">
                            Torne-se Premium para participar de todos os desafios sempre que quiser!
                        </p>
                        <Link to={createPageUrl('Subscription')}>
                            <Button className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg px-8 py-6">
                                <Crown className="w-5 h-5 mr-2" />
                                Assinar Premium - R$ 49,90/mês
                            </Button>
                        </Link>
                        <div className="mt-4">
                            <Link to={createPageUrl('Home')}>
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar ao Início
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {desafio7Dias.imagem_capa && (
                    <div className="h-64 rounded-2xl overflow-hidden shadow-xl">
                        <img 
                            src={desafio7Dias.imagem_capa}
                            alt={desafio7Dias.titulo}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {!progresso ? (
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
                        <CardContent className="p-8 text-center space-y-4">
                            <Sparkles className="w-16 h-16 text-amber-600 mx-auto" />
                            <h2 className="text-2xl font-bold text-stone-800">
                                Comece Sua Transformação
                            </h2>
                            <p className="text-stone-700 max-w-2xl mx-auto">
                                Embarque nesta jornada de 7 dias que irá transformar sua relação com a ansiedade. 
                                Cada dia traz uma nova prática e ensinamento para te guiar.
                            </p>
                            {podeIniciar ? (
                                <Button
                                    onClick={iniciarDesafio}
                                    disabled={createProgressMutation.isPending}
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg py-6 px-8"
                                >
                                    {createProgressMutation.isPending ? 'Iniciando...' : 'Iniciar Desafio Agora'}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            ) : (
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg py-6 px-8">
                                        <Crown className="w-5 h-5 mr-2" />
                                        Ver Planos a partir de R$ 29,90/mês
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-stone-600">Seu Progresso</p>
                                        <p className="text-2xl font-bold text-stone-800">
                                            {progresso.dias_completados?.length || 0} de 7 dias
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-stone-600">Dias desde início</p>
                                        <p className="text-2xl font-bold text-amber-600">{diasDesdeInicioProgresso}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-stone-200 rounded-full h-3">
                                    <div 
                                        className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                        style={{ width: `${((progresso.dias_completados?.length || 0) / 7) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {progresso.completado && (
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                                <CardContent className="p-8 text-center space-y-3">
                                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                                    <h2 className="text-2xl font-bold text-green-900">
                                        Desafio Completado
                                    </h2>
                                    <p className="text-green-800">
                                        Parabéns por completar esta jornada transformadora!
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-amber-300" />
                                Jornada dos 7 Dias
                            </h2>

                            {desafio7Dias.dias.map((dia, index) => {
                                const diaCompletado = progresso.dias_completados?.includes(dia.dia);
                                const diaAtual = progresso.dia_atual === dia.dia;
                                const diaDisponivel = dia.dia <= (progresso.dia_atual || 1);

                                return (
                                    <motion.div
                                        key={dia.dia}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card 
                                            className={`cursor-pointer transition-all duration-300 ${
                                                diaCompletado 
                                                    ? 'bg-green-50/80 border-green-200 hover:shadow-lg' 
                                                    : diaAtual
                                                    ? 'bg-amber-50/80 border-amber-300 hover:shadow-xl ring-2 ring-amber-400'
                                                    : diaDisponivel
                                                    ? 'bg-white/80 hover:shadow-lg border-stone-200'
                                                    : 'bg-stone-50/50 border-stone-100 opacity-60'
                                            }`}
                                            onClick={() => diaDisponivel && setDiaAberto(dia.dia)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                            diaCompletado 
                                                                ? 'bg-green-500' 
                                                                : diaAtual
                                                                ? 'bg-amber-500'
                                                                : diaDisponivel
                                                                ? 'bg-stone-300'
                                                                : 'bg-stone-200'
                                                        }`}>
                                                            {diaCompletado ? (
                                                                <CheckCircle2 className="w-6 h-6 text-white" />
                                                            ) : diaDisponivel ? (
                                                                <span className="text-white font-bold">{dia.dia}</span>
                                                            ) : (
                                                                <Lock className="w-5 h-5 text-stone-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-stone-600">Dia {dia.dia}</p>
                                                            <h3 className="text-lg font-semibold text-stone-800">
                                                                {dia.titulo}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    {diaAtual && !diaCompletado && (
                                                        <Badge className="bg-amber-500 text-white">
                                                            Atual
                                                        </Badge>
                                                    )}
                                                    {diaDisponivel && !diaCompletado && (
                                                        <ArrowRight className="w-5 h-5 text-stone-400" />
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}