import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Sparkles, Crown, Zap, Target, BookOpen, MessageCircle, BookMarked, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressCard from '../components/ProgressCard';

export default function Niveis() {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const niveis = [
        {
            nome: 'Despertar',
            id: 'despertar',
            pontos_min: 0,
            pontos_max: 99,
            cor: 'from-stone-400 to-stone-600',
            icone: Star,
            descricao: 'Você está dando os primeiros passos em sua jornada espiritual. Cada pequena ação conta!'
        },
        {
            nome: 'Buscador',
            id: 'buscador',
            pontos_min: 100,
            pontos_max: 299,
            cor: 'from-amber-400 to-amber-600',
            icone: Target,
            descricao: 'Você começou a buscar ativamente seu crescimento. Continue explorando as práticas!'
        },
        {
            nome: 'Caminhante',
            id: 'caminhante',
            pontos_min: 300,
            pontos_max: 599,
            cor: 'from-emerald-400 to-emerald-600',
            icone: Zap,
            descricao: 'Sua jornada se aprofunda. Você está desenvolvendo disciplina e constância.'
        },
        {
            nome: 'Iluminado',
            id: 'iluminado',
            pontos_min: 600,
            pontos_max: 999,
            cor: 'from-blue-400 to-blue-600',
            icone: Sparkles,
            descricao: 'Você alcançou um nível avançado de consciência e prática regular.'
        },
        {
            nome: 'Mestre',
            id: 'mestre',
            pontos_min: 1000,
            pontos_max: null,
            cor: 'from-purple-400 to-purple-600',
            icone: Crown,
            descricao: 'Você domina as práticas e integrou a espiritualidade em sua vida diária.'
        }
    ];

    const pontosUsuario = user?.pontos_espirituais || 0;
    const nivelAtual = niveis.find(n => 
        pontosUsuario >= n.pontos_min && (n.pontos_max === null || pontosUsuario <= n.pontos_max)
    ) || niveis[0];

    const proximoNivel = niveis.find(n => n.pontos_min > pontosUsuario);
    const pontosParaProximo = proximoNivel ? proximoNivel.pontos_min - pontosUsuario : 0;

    const formasGanharPontos = [
        { acao: 'Completar uma prática espiritual', pontos: 10, icone: Sparkles },
        { acao: 'Ler um artigo de sabedoria', pontos: 5, icone: BookOpen },
        { acao: 'Escrever no diário sagrado', pontos: 8, icone: BookMarked },
        { acao: 'Conversar com o Guia Espiritual', pontos: 3, icone: MessageCircle },
        { acao: 'Completar dia do Desafio 7 Dias', pontos: 15, icone: Calendar },
        { acao: 'Manter sequência diária', pontos: 5, icone: Zap }
    ];

    return (
        <div className="min-h-screen p-6 pb-24 md:pb-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-2">
                        <Trophy className="w-10 h-10" />
                        Sistema de Níveis Espirituais
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Acompanhe sua evolução e celebre cada conquista
                    </p>
                </motion.div>

                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6" />
                            Como Funciona a Gamificação?
                        </h2>
                        <div className="space-y-4 text-stone-700 leading-relaxed">
                            <p>
                                <strong>Bem-vindo ao sistema de evolução espiritual!</strong> Cada ação que você realiza no portal 
                                te aproxima de novos níveis de consciência e desenvolvimento pessoal.
                            </p>
                            <p>
                                Ao participar ativamente das práticas, leituras, reflexões no diário e conversas com o Guia Espiritual, 
                                você acumula <strong>Pontos Espirituais</strong>. Estes pontos refletem seu compromisso com a transformação 
                                interior e o autoconhecimento.
                            </p>
                            <p>
                                À medida que acumula pontos, você avança pelos <strong>5 níveis espirituais</strong>: do Despertar 
                                inicial até alcançar o nível de Mestre. Cada nível representa uma fase única de sua jornada, 
                                com novos insights e profundidade de prática.
                            </p>
                            <p>
                                Mantenha uma prática consistente para construir uma <strong>sequência de dias consecutivos</strong>, 
                                ganhando pontos bônus pela disciplina. Lembre-se: a jornada espiritual não é uma corrida, 
                                mas sim um caminho de presença e dedicação diária.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {user && (
                    <ProgressCard 
                        pontosEspirituais={pontosUsuario}
                        diasConsecutivos={user.dias_consecutivos || 0}
                        nivel={user.nivel_espiritual || 'despertar'}
                    />
                )}

                <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-600" />
                            Como Ganhar Pontos Espirituais
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {formasGanharPontos.map((forma, index) => {
                                const Icone = forma.icone;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-stone-50 to-amber-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icone className="w-5 h-5 text-amber-600" />
                                            <span className="text-stone-800">{forma.acao}</span>
                                        </div>
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                            +{forma.pontos} pontos
                                        </Badge>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-300" />
                        Os 5 Níveis Espirituais
                    </h2>

                    {niveis.map((nivel, index) => {
                        const Icone = nivel.icone;
                        const isAtual = nivel.id === nivelAtual.id;
                        const foiAlcancado = pontosUsuario >= nivel.pontos_min;

                        return (
                            <motion.div
                                key={nivel.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`transition-all duration-300 ${
                                    isAtual 
                                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 ring-2 ring-amber-400 shadow-xl' 
                                        : foiAlcancado
                                        ? 'bg-green-50/50 border-green-200'
                                        : 'bg-stone-50/50 border-stone-200 opacity-75'
                                }`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${nivel.cor} flex-shrink-0`}>
                                                <Icone className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-stone-800">
                                                        {nivel.nome}
                                                    </h3>
                                                    {isAtual && (
                                                        <Badge className="bg-amber-500 text-white">
                                                            Seu Nível Atual
                                                        </Badge>
                                                    )}
                                                    {foiAlcancado && !isAtual && (
                                                        <Badge className="bg-green-500 text-white">
                                                            Alcançado
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-stone-600 mb-3">
                                                    {nivel.descricao}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                                    <span>
                                                        {nivel.pontos_min} - {nivel.pontos_max || '∞'} pontos
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {proximoNivel && (
                    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-purple-900 mb-2">
                                Próximo Objetivo
                            </h3>
                            <p className="text-purple-800 mb-3">
                                Faltam <strong>{pontosParaProximo} pontos</strong> para alcançar o nível <strong>{proximoNivel.nome}</strong>
                            </p>
                            <div className="w-full bg-purple-200 rounded-full h-3">
                                <div 
                                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                                    style={{ width: `${Math.min(100, (pontosUsuario / proximoNivel.pontos_min) * 100)}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}