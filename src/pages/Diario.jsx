import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Smile, Meh, Frown, Heart, Calendar, Crown, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../components/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Diario() {
    const [showForm, setShowForm] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [novaEntrada, setNovaEntrada] = useState({
        titulo: '',
        conteudo: '',
        humor: 'neutro',
        data: format(new Date(), 'yyyy-MM-dd')
    });
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const { data: entries } = useQuery({
        queryKey: ['diaryEntries'],
        queryFn: () => base44.entities.DiaryEntry.filter({ created_by: user?.email }, '-created_date'),
        initialData: [],
        enabled: !!user
    });

    const createEntryMutation = useMutation({
        mutationFn: (entryData) => base44.entities.DiaryEntry.create(entryData),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
            if (user) {
                await base44.auth.updateMe({
                    pontos_espirituais: (user.pontos_espirituais || 0) + 8,
                    entradas_diario: (user.entradas_diario || 0) + 1
                });
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }
            setShowForm(false);
            setNovaEntrada({
                titulo: '',
                conteudo: '',
                humor: 'neutro',
                data: format(new Date(), 'yyyy-MM-dd')
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createEntryMutation.mutate(novaEntrada);
    };

    const isPremium = user?.tipo_assinatura === 'premium';
    const isBasico = user?.tipo_assinatura === 'basico';
    const isAssinante = isPremium || isBasico;

    const humorIcons = {
        muito_bem: { icon: Smile, color: 'text-green-600', label: 'Muito Bem' },
        bem: { icon: Smile, color: 'text-emerald-600', label: 'Bem' },
        neutro: { icon: Meh, color: 'text-amber-600', label: 'Neutro' },
        triste: { icon: Frown, color: 'text-blue-600', label: 'Triste' },
        ansioso: { icon: Heart, color: 'text-rose-600', label: 'Ansioso' }
    };

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-bold gradient-text">
                        Meu Diário Sagrado
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Seu espaço íntimo de reflexão e transformação
                    </p>
                    {!isAssinante && (
                        <p className="text-sm text-amber-300 font-semibold">
                            ✨ Período de degustação — Escreva à vontade!
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
                            Limite Diário Atingido
                        </h2>
                        <p className="text-stone-700 mb-4">
                            Você já escreveu sua entrada de hoje. No período de teste, é permitida 1 entrada por dia.
                        </p>
                        <p className="text-stone-600 mb-6">
                            Torne-se Premium para escrever sempre que quiser!
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

                <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Nova Entrada</span>
                            <Button
                                variant={showForm ? "outline" : "default"}
                                onClick={() => setShowForm(!showForm)}
                                className="bg-gradient-to-r from-amber-600 to-orange-600"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {showForm ? 'Cancelar' : 'Escrever'}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    {showForm && (
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Título (opcional)"
                                    value={novaEntrada.titulo}
                                    onChange={(e) => setNovaEntrada({...novaEntrada, titulo: e.target.value})}
                                />
                                <Textarea
                                    placeholder="O que está em seu coração hoje?"
                                    value={novaEntrada.conteudo}
                                    onChange={(e) => setNovaEntrada({...novaEntrada, conteudo: e.target.value})}
                                    className="min-h-[200px]"
                                    required
                                />
                                <div className="flex gap-4">
                                    <Select
                                        value={novaEntrada.humor}
                                        onValueChange={(value) => setNovaEntrada({...novaEntrada, humor: value})}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Como está se sentindo?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="muito_bem">😊 Muito Bem</SelectItem>
                                            <SelectItem value="bem">🙂 Bem</SelectItem>
                                            <SelectItem value="neutro">😐 Neutro</SelectItem>
                                            <SelectItem value="triste">😔 Triste</SelectItem>
                                            <SelectItem value="ansioso">😰 Ansioso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="submit"
                                        disabled={createEntryMutation.isPending}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600"
                                    >
                                        {createEntryMutation.isPending ? 'Salvando...' : 'Salvar Entrada'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    )}
                </Card>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Suas Entradas</h2>
                    <AnimatePresence>
                        {entries.map((entry, index) => {
                            const HumorIcon = humorIcons[entry.humor]?.icon || Meh;
                            const humorColor = humorIcons[entry.humor]?.color || 'text-stone-600';
                            
                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="bg-white/80 backdrop-blur border-stone-200 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    {entry.titulo && (
                                                        <h3 className="text-xl font-semibold text-stone-800 mb-2">
                                                            {entry.titulo}
                                                        </h3>
                                                    )}
                                                    <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                                                        {entry.conteudo}
                                                    </p>
                                                </div>
                                                <HumorIcon className={`w-6 h-6 ${humorColor} flex-shrink-0`} />
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-stone-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(entry.created_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                </div>
                                                <Badge variant="outline" className={humorColor}>
                                                    {humorIcons[entry.humor]?.label}
                                                </Badge>
                                                {entry.tags && entry.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    
                    {entries.length === 0 && !showLimitModal && (
                        <Card className="bg-stone-50 border-stone-200 p-12 text-center">
                            <p className="text-stone-600">
                                Ainda não há entradas em seu diário. Comece sua jornada de autoconhecimento escrevendo sua primeira reflexão.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}