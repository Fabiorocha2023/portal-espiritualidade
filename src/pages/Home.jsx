import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Sun, Moon, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import ProgressCard from '../components/ProgressCard';
import PremiumBanner from '../components/PremiumBanner';
import { motion } from 'framer-motion';

export default function Home() {
    const [pilulaAtual, setPilulaAtual] = useState(null);

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

    const { data: articles } = useQuery({
        queryKey: ['articles'],
        queryFn: () => base44.entities.Article.list('-created_date', 3),
        initialData: []
    });

    const pilulasDaily = [
        "A energia que você emana é a mesma que você atrai. Cultive paz interior para manifestar harmonia externa.",
        "Seu corpo é um templo sagrado. Cada respiração é uma oportunidade de renovação e conexão com o universo.",
        "Relacionamentos saudáveis começam com o amor que você direciona a si mesmo. Você é completo como é.",
        "O presente é um presente. Cada momento contém toda a eternidade quando você está verdadeiramente presente.",
        "Seus pensamentos criam sua realidade. Escolha conscientemente onde direcionar sua energia mental.",
        "Gratidão é a frequência mais elevada. O que você aprecia, se expande em sua vida.",
        "Você não é suas emoções. Você é o céu que observa as nuvens passarem. Permaneça centrado."
    ];

    useEffect(() => {
        const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        setPilulaAtual(pilulasDaily[diaDoAno % pilulasDaily.length]);
    }, []);

    const praticasDestaque = practices.filter(p => p.nivel === 'free').slice(0, 2);
    const isPremium = user?.tipo_assinatura === 'premium';

    return (
        <div className="min-h-screen p-4 pb-24 md:p-6 md:pb-6 overflow-x-hidden">
            <div className="max-w-4xl mx-auto space-y-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Bem-vindo ao seu Portal
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        {user?.full_name ? `Olá, ${user.full_name.split(' ')[0]}` : 'Sua jornada de transformação começa aqui'}
                        {isPremium && (
                            <span className="ml-2 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                <Sparkles className="w-4 h-4" />
                                Você é Premium!
                            </span>
                        )}
                    </p>
                </motion.div>

                {user && (
                    <ProgressCard 
                        pontosEspirituais={user.pontos_espirituais || 0}
                        diasConsecutivos={user.dias_consecutivos || 0}
                        nivel={user.nivel_espiritual || 'iniciante'}
                    />
                )}

                <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-amber-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stone-700">
                            <Sun className="w-5 h-5 text-amber-600" />
                            Pílula de Sabedoria do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-stone-700 leading-relaxed italic text-lg">
                            "{pilulaAtual}"
                        </p>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-300" />
                        Práticas Recomendadas para Hoje
                    </h2>
                    
                    {praticasDestaque.map((pratica) => (
                        <Link key={pratica.id} to={createPageUrl('Practices')}>
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur border-stone-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-stone-800 mb-2">
                                                {pratica.titulo}
                                            </h3>
                                            <p className="text-stone-600 text-sm mb-3">
                                                {pratica.descricao}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-stone-500">
                                                <span className="flex items-center gap-1">
                                                    <Moon className="w-4 h-4" />
                                                    {pratica.duracao} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4 text-amber-600" />
                                                    +{pratica.pontos_recompensa} pontos
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Heart className="w-6 h-6 text-rose-300" />
                        Novos Artigos de Sabedoria
                    </h2>
                    
                    {articles.slice(0, 2).map((article) => (
                        <Link key={article.id} to={createPageUrl('Sabedoria')}>
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden bg-white/80 backdrop-blur border-stone-200">
                                {article.imagem_capa && (
                                    <div className="h-40 overflow-hidden">
                                        <img 
                                            src={article.imagem_capa} 
                                            alt={article.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold text-stone-800 mb-2">
                                        {article.titulo}
                                    </h3>
                                    <p className="text-stone-600 text-sm mb-3">
                                        {article.subtitulo}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-stone-500">
                                        <span>{article.tempo_leitura} min de leitura</span>
                                        <span className="px-2 py-1 bg-stone-100 rounded-full">
                                            {article.categoria}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {!isPremium && <PremiumBanner />}
            </div>
        </div>
    );
}