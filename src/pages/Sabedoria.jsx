import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Crown, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import PremiumBanner from '../components/PremiumBanner';

export default function Sabedoria() {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [artigoJaMarcado, setArtigoJaMarcado] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const { data: articles } = useQuery({
        queryKey: ['articles'],
        queryFn: () => base44.entities.Article.list('-created_date'),
        initialData: []
    });

    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';
    const isAssinante = isPremium || isBasico;

    useEffect(() => {
        if (selectedArticle && !artigoJaMarcado) {
            const bloqueado = !isPremium && selectedArticle.nivel === 'premium';
            if (!bloqueado && user) {
                base44.auth.updateMe({
                    pontos_espirituais: (user.pontos_espirituais || 0) + (selectedArticle.pontos_recompensa || 5),
                    artigos_lidos: (user.artigos_lidos || 0) + 1
                });
                setArtigoJaMarcado(true);
            }
        }
        if (!selectedArticle) {
            setArtigoJaMarcado(false);
        }
    }, [selectedArticle, artigoJaMarcado, user, isPremium]);

    const categoriaColors = {
        mente: 'bg-purple-100 text-purple-800',
        corpo: 'bg-green-100 text-green-800',
        emocoes: 'bg-blue-100 text-blue-800',
        relacionamentos: 'bg-pink-100 text-pink-800',
        proposito: 'bg-amber-100 text-amber-800',
        energia: 'bg-indigo-100 text-indigo-800'
    };

    if (selectedArticle) {
        const bloqueado = !isPremium && selectedArticle.nivel === 'premium';

        return (
            <div className="min-h-screen p-6 pb-24">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedArticle(null)}
                        className="mb-4 text-white hover:text-amber-300 hover:bg-purple-800/30"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    {selectedArticle.imagem_capa && (
                        <div className="h-96 overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src={selectedArticle.imagem_capa}
                                alt={selectedArticle.titulo}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <Card className="bg-white/90 backdrop-blur border-stone-200 shadow-xl">
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-stone-900 mb-3 leading-tight">
                                    {selectedArticle.titulo}
                                </h1>
                                <p className="text-xl text-stone-600 italic">
                                    {selectedArticle.subtitulo}
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap items-center">
                                <Badge className={categoriaColors[selectedArticle.categoria]}>
                                    {selectedArticle.categoria}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {selectedArticle.tempo_leitura} min de leitura
                                </Badge>
                                {selectedArticle.nivel === 'premium' && (
                                    <Badge variant="outline" className="flex items-center gap-1 border-amber-300 text-amber-700">
                                        <Crown className="w-3 h-3" />
                                        Premium
                                    </Badge>
                                )}
                                {selectedArticle.tags && selectedArticle.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>

                            <hr className="border-stone-200" />

                            {bloqueado ? (
                                <div className="text-center py-12 space-y-4">
                                    <Crown className="w-16 h-16 text-amber-600 mx-auto" />
                                    <h3 className="text-2xl font-bold text-stone-800">
                                        Conteúdo Premium
                                    </h3>
                                    <p className="text-stone-600 max-w-md mx-auto">
                                        Este artigo faz parte do conteúdo exclusivo para membros Premium. 
                                        Desbloqueie acesso ilimitado a toda biblioteca de sabedoria.
                                    </p>
                                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                        Tornar-se Premium
                                    </Button>
                                </div>
                            ) : (
                                <div className="prose prose-stone prose-lg max-w-none">
                                    <ReactMarkdown>{selectedArticle.conteudo}</ReactMarkdown>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Biblioteca de Sabedoria
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Artigos profundos sobre transformação e autoconhecimento
                    </p>
                    {!isAssinante && (
                        <p className="text-sm text-amber-300 font-semibold">
                            ✨ Período de degustação — Leia à vontade!
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
                            Você já utilizou suas 3 interações gratuitas com a Biblioteca de Sabedoria durante o período de teste.
                        </p>
                        <p className="text-stone-600 mb-6">
                            Torne-se Premium para acessar todos os artigos sempre que precisar!
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

                <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {articles.map((article, index) => {
                            const bloqueado = !isPremium && article.nivel === 'premium';

                            return (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        className={`h-full hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden bg-white/80 backdrop-blur border-stone-200 relative ${
                                            bloqueado ? 'opacity-90' : ''
                                        }`}
                                        onClick={() => setSelectedArticle(article)}
                                    >
                                        {bloqueado && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <Crown className="w-6 h-6 text-amber-600" />
                                            </div>
                                        )}
                                        {article.imagem_capa && (
                                            <div className="h-56 overflow-hidden">
                                                <img
                                                    src={article.imagem_capa}
                                                    alt={article.titulo}
                                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-6 space-y-3">
                                            <h3 className="text-2xl font-bold text-stone-800 line-clamp-2">
                                                {article.titulo}
                                            </h3>
                                            <p className="text-stone-600 line-clamp-2">
                                                {article.subtitulo}
                                            </p>
                                            <div className="flex gap-2 flex-wrap items-center">
                                                <Badge className={categoriaColors[article.categoria]} variant="secondary">
                                                    {article.categoria}
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {article.tempo_leitura} min
                                                </Badge>
                                            </div>
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