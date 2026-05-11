import React from 'react';
import { TrendingUp, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressCard({ pontosEspirituais = 0, diasConsecutivos = 0, nivel = 'despertar' }) {
    const niveis = {
        'despertar':  { label: 'Despertar',  color: 'from-stone-400 to-stone-600',   min: 0,    proxNivel: 100  },
        'iniciante':  { label: 'Despertar',  color: 'from-stone-400 to-stone-600',   min: 0,    proxNivel: 100  },
        'buscador':   { label: 'Buscador',   color: 'from-amber-400 to-amber-600',   min: 100,  proxNivel: 300  },
        'caminhante': { label: 'Caminhante', color: 'from-emerald-400 to-emerald-600', min: 300, proxNivel: 600 },
        'iluminado':  { label: 'Iluminado',  color: 'from-blue-400 to-blue-600',     min: 600,  proxNivel: 1000 },
        'mestre':     { label: 'Mestre',     color: 'from-purple-400 to-purple-600', min: 1000, proxNivel: null }
    };

    const nivelAtual = niveis[nivel] || niveis.despertar;
    const faltam = nivelAtual.proxNivel ? Math.max(0, nivelAtual.proxNivel - pontosEspirituais) : 0;
    const progresso = nivelAtual.proxNivel
        ? Math.min(100, ((pontosEspirituais - nivelAtual.min) / (nivelAtual.proxNivel - nivelAtual.min)) * 100)
        : 100;

    return (
        <Card className="bg-gradient-to-br from-white/80 to-stone-50/80 backdrop-blur border-stone-200 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-700">
                    <Award className="w-5 h-5 text-amber-600" />
                    Sua Jornada Espiritual
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-lg font-semibold bg-gradient-to-r ${nivelAtual.color} bg-clip-text text-transparent`}>
                            {nivelAtual.label}
                        </span>
                        <span className="text-sm text-stone-500 italic">{pontosEspirituais} gotas de luz</span>
                    </div>
                    {nivelAtual.proxNivel && (
                        <>
                            <div className="w-full bg-stone-200 rounded-full h-2.5 mb-1">
                                <div
                                    className={`h-2.5 rounded-full bg-gradient-to-r ${nivelAtual.color} transition-all duration-500`}
                                    style={{ width: `${progresso}%` }}
                                />
                            </div>
                            <p className="text-xs text-stone-500">
                                {faltam > 0 ? `Mais ${faltam} passos para ${Object.values(niveis).find(n => n.min === nivelAtual.proxNivel)?.label || 'o próximo nível'}` : 'Você está crescendo! 🌱'}
                            </p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <div>
                            <p className="text-xs text-stone-500">Chama Viva</p>
                            <p className="text-lg font-bold text-stone-800">{diasConsecutivos} {diasConsecutivos === 1 ? 'dia' : 'dias'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <div>
                            <p className="text-xs text-stone-500">Luz Interior</p>
                            <p className="text-lg font-bold text-stone-800">{pontosEspirituais}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}