import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Heart, Send, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const INTENCOES_INSPIRACAO = [
    "Hoje escolho a paz como meu lar interior.",
    "Estou aberto(a) para receber os ensinamentos do presente.",
    "Cada respiração me aproxima de quem realmente sou.",
    "Confio no processo da minha jornada.",
    "Hoje sou grato(a) pela luz que existe em mim.",
];

export default function Comunidade() {
    const [novaIntencao, setNovaIntencao] = useState('');
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const { data: intencoes = [] } = useQuery({
        queryKey: ['intencoes'],
        queryFn: () => base44.entities.IntencaoComunidade.list('-created_date', 30),
    });

    const criarIntencao = useMutation({
        mutationFn: (texto) => base44.entities.IntencaoComunidade.create({ texto }),
        onSuccess: () => {
            setNovaIntencao('');
            queryClient.invalidateQueries({ queryKey: ['intencoes'] });
        }
    });

    const curtirIntencao = useMutation({
        mutationFn: ({ id, curtidas }) => base44.entities.IntencaoComunidade.update(id, { curtidas: (curtidas || 0) + 1 }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['intencoes'] })
    });

    const inspiracaoAleatoria = INTENCOES_INSPIRACAO[Math.floor(Math.random() * INTENCOES_INSPIRACAO.length)];

    return (
        <div className="min-h-screen p-4 pb-24 md:p-6 md:pb-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
                    <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-2">
                        <Users className="w-9 h-9" />
                        Círculo Sagrado
                    </h1>
                    <p className="text-indigo-200 text-base">
                        Você não caminha sozinho(a). Compartilhe uma intenção e inspire outras almas nesta jornada.
                    </p>
                </motion.div>

                {/* Caixa de nova intenção */}
                <Card className="bg-white/90 backdrop-blur border-purple-200 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-indigo-900 text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Compartilhe sua intenção de hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea
                            value={novaIntencao}
                            onChange={e => setNovaIntencao(e.target.value)}
                            placeholder={`Inspiração: "${inspiracaoAleatoria}"`}
                            className="resize-none border-purple-200 focus:border-purple-400"
                            rows={3}
                            maxLength={280}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-stone-400">{novaIntencao.length}/280</span>
                            <Button
                                onClick={() => novaIntencao.trim() && criarIntencao.mutate(novaIntencao.trim())}
                                disabled={!novaIntencao.trim() || criarIntencao.isPending}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Enviar ao Círculo
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Feed de intenções */}
                <div className="space-y-3">
                    <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-300" />
                        Intenções da comunidade
                    </h2>
                    <AnimatePresence>
                        {intencoes.length === 0 && (
                            <p className="text-indigo-300 text-sm text-center py-6">
                                Seja o(a) primeiro(a) a iluminar o círculo hoje. ✨
                            </p>
                        )}
                        {intencoes.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Card className="bg-white/85 backdrop-blur border-stone-200">
                                    <CardContent className="p-4">
                                        <p className="text-stone-800 leading-relaxed mb-3 italic">"{item.texto}"</p>
                                        <div className="flex items-center justify-between text-xs text-stone-400">
                                            <span>
                                                {item.created_by
                                                    ? item.created_by.split('@')[0]
                                                    : 'Alma anônima'
                                                } · {format(new Date(item.created_date), "d MMM", { locale: ptBR })}
                                            </span>
                                            <button
                                                onClick={() => curtirIntencao.mutate({ id: item.id, curtidas: item.curtidas })}
                                                className="flex items-center gap-1 text-rose-400 hover:text-rose-600 transition-colors"
                                            >
                                                <Heart className="w-3.5 h-3.5 fill-current" />
                                                <span>{item.curtidas || 0}</span>
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}