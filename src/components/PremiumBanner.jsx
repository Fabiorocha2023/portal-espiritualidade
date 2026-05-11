import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function PremiumBanner() {
    const [ciclo, setCiclo] = useState('mensal');

    return (
        <div className="space-y-3">
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-full p-1 max-w-xs mx-auto">
                <button
                    onClick={() => setCiclo('mensal')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${ciclo === 'mensal' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200'}`}
                >
                    Mensal
                </button>
                <button
                    onClick={() => setCiclo('anual')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${ciclo === 'anual' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200'}`}
                >
                    Anual 🏷️
                </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {ciclo === 'mensal' ? (
                    <>
                        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden relative">
                            <div className="relative p-5 space-y-3">
                                <h3 className="text-lg font-bold">Plano Básico</h3>
                                <p className="text-white/90 text-sm">Tudo ilimitado + 1 conversa/mês com o Guia Espiritual</p>
                                <p className="text-2xl font-bold">R$ 29,90<span className="text-sm font-normal">/mês</span></p>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="w-full bg-white text-blue-700 hover:bg-white/90 font-semibold">
                                        Assinar Básico
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white border-0 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                            <div className="relative p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-5 h-5" />
                                    <h3 className="text-lg font-bold">Plano Premium</h3>
                                </div>
                                <p className="text-white/90 text-sm">18 conversas/mês com o Guia + 7 dias grátis</p>
                                <p className="text-2xl font-bold">R$ 89,90<span className="text-sm font-normal">/mês</span></p>
                                <Link to={createPageUrl('Subscription')}>
                                    <Button className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold">
                                        Começar Grátis
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden relative">
                            <div className="bg-blue-500/50 text-white text-xs font-bold px-3 py-1 text-center">💰 ECONOMIZE R$59 — R$24,99/mês</div>
                            <div className="relative p-5 space-y-3">
                                <h3 className="text-lg font-bold">Básico Anual</h3>
                                <p className="text-white/90 text-sm">Tudo ilimitado + <strong>10 conversas</strong> com o Guia no ano</p>
                                <p className="text-2xl font-bold">R$ 299,90<span className="text-sm font-normal">/ano</span></p>
                                <Link to={createPageUrl('Subscription', { ciclo: 'anual' })}>
                                    <Button className="w-full bg-white text-blue-700 hover:bg-white/90 font-semibold">
                                        Assinar Básico Anual
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white border-0 shadow-xl overflow-hidden relative">
                            <div className="bg-amber-500/50 text-white text-xs font-bold px-3 py-1 text-center">⭐ MELHOR VALOR — R$74,99/mês</div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                            <div className="relative p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-5 h-5" />
                                    <h3 className="text-lg font-bold">Premium Anual</h3>
                                </div>
                                <p className="text-white/90 text-sm"><strong>180 conversas</strong> com o Guia no ano + extras disponíveis</p>
                                <p className="text-2xl font-bold">R$ 899,90<span className="text-sm font-normal">/ano</span></p>
                                <Link to={createPageUrl('Subscription', { ciclo: 'anual' })}>
                                    <Button className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold">
                                        Assinar Premium Anual
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}