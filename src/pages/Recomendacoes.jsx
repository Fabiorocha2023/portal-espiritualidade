import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, Calendar, MessageCircle, BookOpen, BookMarked, Trophy, Crown, Clock, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import { Button } from '@/components/ui/button';

export default function Recomendacoes() {
    const funcionalidades = [
        {
            nome: 'Práticas Guiadas',
            icone: Sparkles,
            cor: 'from-emerald-400 to-teal-600',
            descricao: 'Meditações, respirações e visualizações com áudio guiado para transformar sua energia diária.',
            link: 'Practices'
        },
        {
            nome: 'Desafio de 7 Dias',
            icone: Calendar,
            cor: 'from-amber-400 to-orange-600',
            descricao: 'Jornada intensiva para vencer a ansiedade com práticas diárias progressivas.',
            link: 'Desafio7Dias'
        },
        {
            nome: 'Guia Espiritual',
            icone: MessageCircle,
            cor: 'from-purple-400 to-indigo-600',
            descricao: 'Converse com uma inteligência sábia sobre suas questões espirituais e receba orientação personalizada.',
            link: 'GuiaEspiritual'
        },
        {
            nome: 'Biblioteca de Sabedoria',
            icone: BookOpen,
            cor: 'from-blue-400 to-cyan-600',
            descricao: 'Artigos profundos sobre mente, corpo, emoções, relacionamentos e propósito de vida.',
            link: 'Sabedoria'
        },
        {
            nome: 'Diário Sagrado',
            icone: BookMarked,
            cor: 'from-rose-400 to-pink-600',
            descricao: 'Seu espaço íntimo para reflexões, gratidão e acompanhamento de seu humor e evolução.',
            link: 'Diario'
        },
        {
            nome: 'Sistema de Níveis',
            icone: Trophy,
            cor: 'from-yellow-400 to-amber-600',
            descricao: 'Gamificação que reconhece seu progresso desde o Despertar até Mestre Espiritual.',
            link: 'Niveis'
        }
    ];

    const rotinaDiaria = [
        {
            momento: 'Ao Acordar (5-10 min)',
            atividades: [
                'Abra o app e leia a Pílula de Sabedoria do dia',
                'Faça uma prática de respiração ou meditação matinal',
                'Ganhe seus primeiros pontos espirituais do dia'
            ],
            icone: Clock,
            cor: 'bg-amber-50 border-amber-200'
        },
        {
            momento: 'Durante o Dia',
            atividades: [
                'Nos momentos de pausa, converse com seu Guia Espiritual',
                'Leia um artigo da biblioteca durante o almoço ou pausa',
                'Continue seu Desafio de 7 Dias se estiver participando'
            ],
            icone: Zap,
            cor: 'bg-blue-50 border-blue-200'
        },
        {
            momento: 'À Noite (10-15 min)',
            atividades: [
                'Escreva no seu Diário Sagrado sobre o dia',
                'Faça uma prática para relaxamento e sono',
                'Revise seus pontos e progresso conquistados'
            ],
            icone: Heart,
            cor: 'bg-purple-50 border-purple-200'
        }
    ];

    return (
        <div className="min-h-screen p-6 pb-24 md:pb-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-3"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Bem-vindo ao Portal da Espiritualidade
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Sua jornada completa de transformação interior, autoconhecimento e paz começa aqui
                    </p>
                </motion.div>

                {/* AVISO IMPORTANTE SOBRE TESTE GRATUITO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50 shadow-xl">
                        <CardContent className="p-6 text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-amber-200">
                                <Sparkles className="w-6 h-6" />
                                <h3 className="text-2xl font-bold">Período de Teste Gratuito</h3>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <p className="text-indigo-50 text-lg max-w-2xl mx-auto leading-relaxed">
                                Durante seus <strong className="text-amber-300">7 dias de teste gratuito</strong>, você recebe:
                            </p>
                            <div className="text-indigo-100 text-sm max-w-2xl mx-auto space-y-2 bg-white/10 rounded-lg p-4">
                                <p>🧘 <strong className="text-amber-300">Práticas Espirituais:</strong> 3 interações</p>
                                <p>📚 <strong className="text-amber-300">Biblioteca de Sabedoria:</strong> 3 interações</p>
                                <p>📅 <strong className="text-amber-300">Desafio 7 Dias:</strong> 3 interações</p>
                                <p>📖 <strong className="text-amber-300">Diário Sagrado:</strong> 1 entrada por dia durante 7 dias</p>
                                <p className="text-yellow-200 text-xs mt-2">⚠️ O Guia Espiritual (IA) não está disponível na degustação gratuita.</p>
                            </div>
                            <p className="text-indigo-100 text-sm max-w-2xl mx-auto mt-3">
                                Assine o plano Premium por apenas <strong className="text-amber-300">R$ 89,90/mês</strong> e ganhe <strong className="text-amber-300">18 créditos de mensagem + 720 de integração</strong> para o Guia Espiritual, além de acesso ilimitado às demais funcionalidades!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-xl">
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-900">
                            <Target className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">O Que É Este Portal?</h2>
                        </div>
                        <div className="space-y-3 text-stone-700 leading-relaxed">
                            <p>
                                O <strong>Portal da Espiritualidade</strong> é seu companheiro digital na jornada de 
                                desenvolvimento pessoal e espiritual. Combinamos práticas ancestrais de meditação, 
                                respiração e mindfulness com tecnologia moderna para criar uma experiência transformadora.
                            </p>
                            <p>
                                Nosso objetivo é simples: <strong>ajudar você a encontrar paz interior, clareza mental 
                                e propósito de vida</strong> através de práticas diárias acessíveis, conteúdo profundo 
                                e um sistema de acompanhamento que celebra cada passo da sua evolução.
                            </p>
                            <p className="text-indigo-800 font-semibold">
                                💫 Seja você iniciante ou praticante experiente, há um caminho personalizado esperando por você aqui.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-amber-300" />
                        Funcionalidades do Portal
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {funcionalidades.map((func, index) => {
                            const Icone = func.icone;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={createPageUrl(func.link)}>
                                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur border-stone-200">
                                            <CardContent className="p-6 space-y-3">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${func.cor} flex items-center justify-center`}>
                                                    <Icone className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-stone-800">
                                                    {func.nome}
                                                </h3>
                                                <p className="text-stone-600 text-sm leading-relaxed">
                                                    {func.descricao}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2 text-emerald-900">
                            <Clock className="w-6 h-6" />
                            Rotina Diária Recomendada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-stone-700">
                            Para obter os melhores resultados, recomendamos dedicar <strong>20-30 minutos por dia</strong> 
                            ao portal, distribuídos ao longo do seu dia. Aqui está uma sugestão:
                        </p>

                        {rotinaDiaria.map((periodo, index) => {
                            const Icone = periodo.icone;
                            return (
                                <Card key={index} className={`${periodo.cor} border`}>
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Icone className="w-5 h-5 text-stone-700" />
                                            <h3 className="font-bold text-stone-800 text-lg">
                                                {periodo.momento}
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 ml-8">
                                            {periodo.atividades.map((atividade, i) => (
                                                <li key={i} className="text-stone-700 text-sm flex items-start gap-2">
                                                    <span className="text-amber-600 mt-1">•</span>
                                                    <span>{atividade}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-3 text-purple-900">
                            <Trophy className="w-7 h-7" />
                            <h2 className="text-2xl font-bold">Dicas para Maximizar Sua Jornada</h2>
                        </div>
                        <div className="space-y-3 text-stone-700">
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">1.</span>
                                <p>
                                    <strong>Comece com o Desafio de 7 Dias:</strong> É a melhor forma de criar o hábito 
                                    e experimentar rapidamente os benefícios das práticas.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">2.</span>
                                <p>
                                    <strong>Use fones de ouvido:</strong> Para as práticas guiadas, fones criam uma 
                                    experiência mais imersiva e reduzem distrações.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">3.</span>
                                <p>
                                    <strong>Seja consistente, não perfeito:</strong> Mesmo 5 minutos por dia são melhores 
                                    que 1 hora uma vez por semana. Construa o hábito gradualmente.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">4.</span>
                                <p>
                                    <strong>Converse com o Guia:</strong> Use o Guia Espiritual para esclarecer dúvidas, 
                                    receber orientação personalizada e aprofundar sua compreensão.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">5.</span>
                                <p>
                                    <strong>Registre no Diário:</strong> A escrita reflexiva potencializa os insights 
                                    e ajuda você a acompanhar sua evolução emocional.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-purple-600 font-bold">6.</span>
                                <p>
                                    <strong>Acompanhe seus pontos:</strong> O sistema de níveis não é apenas um jogo - 
                                    ele reflete seu comprometimento real com a transformação.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Plano Básico Mensal */}
                        <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white border-0 shadow-xl">
                            <CardContent className="p-6 space-y-3 text-center">
                                <h2 className="text-xl font-bold">Plano Básico</h2>
                                <p className="text-white/90 text-sm leading-relaxed">Acesso ilimitado a todas as funcionalidades + 1 conversa/mês com o Guia Espiritual (IA).</p>
                                <p className="text-3xl font-bold">R$ 29,90<span className="text-base font-normal">/mês</span></p>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold w-full mt-2">Assinar Básico</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Plano Premium Mensal */}
                        <Card className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white border-0 shadow-xl">
                            <CardContent className="p-6 space-y-3 text-center">
                                <Crown className="w-10 h-10 mx-auto" />
                                <h2 className="text-xl font-bold">Plano Premium</h2>
                                <p className="text-white/90 text-sm leading-relaxed">Tudo do Básico + 18 créditos mensais para o Guia Espiritual + pacotes extras. 7 dias grátis!</p>
                                <p className="text-3xl font-bold">R$ 89,90<span className="text-base font-normal">/mês</span></p>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold w-full mt-2">Começar Teste Grátis</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Planos Anuais */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white border-0 shadow-xl overflow-hidden">
                            <div className="bg-blue-500/60 text-white text-xs font-bold px-4 py-1 text-center">💰 ANUAL — ECONOMIZE R$59 — R$24,99/mês</div>
                            <CardContent className="p-6 space-y-3 text-center">
                                <h2 className="text-xl font-bold">Básico Anual</h2>
                                <p className="text-white/90 text-sm leading-relaxed">Acesso ilimitado + <strong>10 conversas</strong> com o Guia no ano (vs 1/mês no mensal).</p>
                                <p className="text-3xl font-bold">R$ 299,90<span className="text-base font-normal">/ano</span></p>
                                <Link to={createPageUrl('Subscription', { ciclo: 'anual' })}>
                                    <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold w-full mt-2">Assinar Básico Anual</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-700 via-orange-700 to-rose-700 text-white border-0 shadow-xl overflow-hidden">
                            <div className="bg-amber-500/60 text-white text-xs font-bold px-4 py-1 text-center">⭐ ANUAL — MELHOR VALOR — R$74,99/mês</div>
                            <CardContent className="p-6 space-y-3 text-center">
                                <Crown className="w-10 h-10 mx-auto" />
                                <h2 className="text-xl font-bold">Premium Anual</h2>
                                <p className="text-white/90 text-sm leading-relaxed"><strong>180 conversas</strong> com o Guia no ano + 7.200 créditos de integração. Economize R$179!</p>
                                <p className="text-3xl font-bold">R$ 899,90<span className="text-base font-normal">/ano</span></p>
                                <Link to={createPageUrl('Subscription', { ciclo: 'anual' })}>
                                    <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold w-full mt-2">Assinar Premium Anual</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Crown className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">Sistema de Créditos - Como Funciona</h2>
                        </div>
                        
                        {/* Explicação dos Tipos de Créditos */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">💡 Entenda os Tipos de Créditos:</h3>
                            <div className="space-y-3 text-white/90 text-sm">
                                <div>
                                    <p className="font-bold text-amber-300 mb-1">🗨️ Créditos de Mensagem:</p>
                                    <p className="ml-4">Usados quando você interage com o Guia Espiritual (IA). Cada conversa consome 1 crédito de mensagem.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-green-300 mb-1">⚡ Créditos de Integração:</p>
                                    <p className="ml-4">São consumidos automaticamente nas diversas tarefas do aplicativo que utilizam IA. Você pode monitorar o uso desses créditos na página de compra de créditos.</p>
                                    <p className="ml-4 mt-1 text-xs italic">
                                        📊 Premium: 18 créditos de mensagem + 720 créditos de integração mensais
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">✨ Plano FREE (Degustação 7 dias):</h3>
                                <ul className="space-y-2 text-white/90 text-sm ml-4">
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Guia Espiritual:</strong> ❌ Não disponível na degustação</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Práticas Espirituais:</strong> 3 interações</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Biblioteca de Sabedoria:</strong> 3 interações</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Desafio 7 Dias:</strong> 3 interações</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Diário Sagrado:</strong> 1 entrada por dia durante 7 dias</span></li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">🔵 Plano BÁSICO (R$ 29,90/mês | R$ 299,90/ano):</h3>
                                <ul className="space-y-2 text-white/90 text-sm ml-4">
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span>Acesso <strong>ilimitado</strong> a Práticas, Sabedoria, Diário e Desafios</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Mensal:</strong> 1 interação/mês com o Guia Espiritual (IA)</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-300">•</span><span><strong>Anual:</strong> 10 interações com o Guia no ano (×10)</span></li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">👑 Plano PREMIUM (R$ 89,90/mês | R$ 899,90/ano):</h3>
                                <ul className="space-y-2 text-white/90 text-sm ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Mensal:</strong> 18 créditos de mensagem + 720 de integração por mês</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Anual:</strong> 180 créditos de mensagem + 7.200 de integração no ano (×10)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Acesso ilimitado a: Práticas, Sabedoria, Diário, Desafios, Níveis</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Alerta automático</strong> quando os créditos estiverem acabando</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Créditos renovam automaticamente todo mês</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-3">💰 Pacotes de Créditos Extras (Premium):</h3>
                                <ul className="space-y-2 text-white/90 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Pacote R$ 20:</strong> 8 créditos de mensagem + 320 de integração</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Pacote R$ 40:</strong> 16 créditos de mensagem + 640 de integração</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Pacote R$ 60:</strong> 24 créditos de mensagem + 960 de integração</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Disponível apenas para usuários Premium</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Pode ser comprado a qualquer momento</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Usados automaticamente após consumir os créditos mensais</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Você pode acumular múltiplos pacotes</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-red-500/20 border border-red-400 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-3">⚠️ Importante - Consumo de Créditos:</h3>
                                <ul className="space-y-2 text-white/90 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Guia Espiritual:</strong> Consome 1 crédito de mensagem por conversa</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Créditos de integração:</strong> Consumidos automaticamente durante o uso das funcionalidades do app</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span><strong>Outras funcionalidades:</strong> Práticas, Sabedoria, Diário e Desafios são ilimitados no Premium</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Alerta aparece automaticamente quando os créditos estiverem acabando</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-300">•</span>
                                        <span>Sem créditos, você pode comprar pacotes extras imediatamente</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-stone-50 to-amber-50 border-stone-200">
                    <CardContent className="p-8 text-center space-y-4">
                        <Sparkles className="w-12 h-12 text-amber-600 mx-auto" />
                        <h3 className="text-2xl font-bold text-stone-800">
                            Sua Jornada Começa Agora
                        </h3>
                        <p className="text-stone-600 max-w-xl mx-auto leading-relaxed">
                            Cada grande transformação começa com um único passo. Que este portal seja seu 
                            companheiro fiel nesta jornada de autoconhecimento, paz e realização.
                        </p>
                        <p className="text-stone-700 font-semibold italic">
                            "O caminho de mil quilômetros começa com um único passo." - Lao Tsé
                        </p>
                        <Link to={createPageUrl('Practices')}>
                            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-base px-6 py-3 mt-4 h-auto whitespace-normal text-center">
                                Começar Minha Primeira Prática
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}