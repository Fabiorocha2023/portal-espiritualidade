import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Zap, Crown, Filter, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import PremiumBanner from '../components/PremiumBanner';
import AudioPlayer from '../components/AudioPlayer';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Practices() {
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const { data: practices } = useQuery({
        queryKey: ['practices'],
        queryFn: () => base44.entities.Practice.list(),
        initialData: []
    });

    const completarPratica = useMutation({
        mutationFn: async (pratica) => {
            if (user) {
                await base44.auth.updateMe({
                    pontos_espirituais: (user.pontos_espirituais || 0) + pratica.pontos_recompensa,
                    praticas_completadas: (user.praticas_completadas || 0) + 1
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            setSelectedPractice(null);
        }
    });

    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';
    const isAssinante = isPremium || isBasico;

    const practicasFiltradas = practices.filter(p => {
        const categoriaMatch = filtroCategoria === 'todas' || p.categoria === filtroCategoria;
        const tipoMatch = filtroTipo === 'todos' || p.tipo === filtroTipo;
        return categoriaMatch && tipoMatch;
    });

    const categoriaColors = {
        ansiedade: 'bg-blue-100 text-blue-800',
        foco: 'bg-purple-100 text-purple-800',
        sono: 'bg-indigo-100 text-indigo-800',
        amor_proprio: 'bg-pink-100 text-pink-800',
        proposito: 'bg-amber-100 text-amber-800',
        gratidao: 'bg-emerald-100 text-emerald-800'
    };

    if (selectedPractice) {
        return (
            <div className="min-h-screen p-6 pb-24 md:pb-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedPractice(null)}
                        className="mb-4 text-white hover:text-amber-300 hover:bg-purple-800/30"
                    >
                        ← Voltar
                    </Button>

                    <Card className="bg-gradient-to-br from-white/90 to-stone-50/90 backdrop-blur border-stone-200 shadow-2xl">
                        {selectedPractice.imagem_url && (
                            <div className="h-64 overflow-hidden rounded-t-lg">
                                <img
                                    src={selectedPractice.imagem_url}
                                    alt={selectedPractice.titulo}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800';
                                    }}
                                />
                            </div>
                        )}
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-stone-800 mb-2">
                                    {selectedPractice.titulo}
                                </h1>
                                <p className="text-stone-600 text-lg">
                                    {selectedPractice.descricao}
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <Badge className={categoriaColors[selectedPractice.categoria]}>
                                    {selectedPractice.categoria}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {selectedPractice.duracao} minutos
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-600" />
                                    +{selectedPractice.pontos_recompensa} pontos
                                </Badge>
                            </div>

                            {selectedPractice.audio_texto && (
                                <AudioPlayer
                                    audioUrl={selectedPractice.audio_url}
                                    texto={selectedPractice.audio_texto}
                                    titulo={selectedPractice.titulo}
                                />
                            )}

                            <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                                <h3 className="font-semibold text-stone-800 text-lg">
                                    Guia da Prática
                                </h3>
                                <div className="prose prose-stone max-w-none">
                                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedPractice.audio_texto}
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={() => completarPratica.mutate(selectedPractice)}
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg py-6"
                                disabled={completarPratica.isPending}
                            >
                                {completarPratica.isPending ? 'Salvando...' : '✓ Completar Prática'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pb-24 md:pb-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Práticas Espirituais
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Rituais sagrados para transformação diária
                    </p>
                    {!isAssinante && (
                        <p className="text-sm text-amber-300 font-semibold">
                            ✨ Período de degustação — Explore à vontade!
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
                            Você já utilizou suas 3 interações gratuitas com Práticas Espirituais durante o período de teste.
                        </p>
                        <p className="text-stone-600 mb-6">
                            Torne-se Premium para acessar todas as práticas sempre que precisar!
                        </p>
                        <Link to={createPageUrl('Subscription')}>
                            <Button className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg px-8 py-6">
                                <Crown className="w-5 h-5 mr-2" />
                                Ver Planos de Assinatura
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

                <Card className="bg-purple-900/40 backdrop-blur border-purple-500/30">
                    <CardContent className="p-4">
                        <div className="flex gap-4 items-center flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-indigo-200" />
                                <span className="text-sm text-indigo-50 font-medium">Filtros:</span>
                            </div>
                            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                                <SelectTrigger className="w-40 bg-white/10 text-indigo-50 border-indigo-300">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas Categorias</SelectItem>
                                    <SelectItem value="ansiedade">Ansiedade</SelectItem>
                                    <SelectItem value="foco">Foco</SelectItem>
                                    <SelectItem value="sono">Sono</SelectItem>
                                    <SelectItem value="amor_proprio">Amor Próprio</SelectItem>
                                    <SelectItem value="proposito">Propósito</SelectItem>
                                    <SelectItem value="gratidao">Gratidão</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                <SelectTrigger className="w-40 bg-white/10 text-indigo-50 border-indigo-300">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos Tipos</SelectItem>
                                    <SelectItem value="meditacao">Meditação</SelectItem>
                                    <SelectItem value="respiracao">Respiração</SelectItem>
                                    <SelectItem value="visualizacao">Visualização</SelectItem>
                                    <SelectItem value="movimento">Movimento</SelectItem>
                                    <SelectItem value="reflexao">Reflexão</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {practicasFiltradas.map((pratica, index) => {
                            const bloqueado = !isPremium && pratica.nivel === 'premium';

                            return (
                                <motion.div
                                    key={pratica.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`h-full hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 ${
                                        bloqueado ? 'opacity-75' : 'cursor-pointer'
                                    } bg-purple-900/40 backdrop-blur border-purple-500/30 relative overflow-hidden`}
                                    onClick={() => !bloqueado && setSelectedPractice(pratica)}
                                    >
                                        {bloqueado && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <Crown className="w-6 h-6 text-amber-600" />
                                            </div>
                                        )}
                                        {pratica.imagem_url && (
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={pratica.imagem_url}
                                                    alt={pratica.titulo}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-6 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {pratica.titulo}
                                                </h3>
                                                <p className="text-indigo-100 text-sm line-clamp-2">
                                                    {pratica.descricao}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge className={categoriaColors[pratica.categoria]} variant="secondary">
                                                    {pratica.categoria}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-1 bg-white/10 text-indigo-100 border-indigo-300">
                                                    <Clock className="w-3 h-3" />
                                                    {pratica.duracao} min
                                                </Badge>
                                            </div>

                                            {!bloqueado ? (
                                                <Button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 shadow-lg shadow-purple-500/30">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Iniciar Prática
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="w-full border-amber-400/50 text-amber-300 hover:bg-amber-500/20">
                                                    <Crown className="w-4 h-4 mr-2" />
                                                    Premium
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {!isAssinante && <PremiumBanner />}
            </div>
        </div>
    );
}