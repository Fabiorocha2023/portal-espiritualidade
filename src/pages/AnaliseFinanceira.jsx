import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AnaliseFinanceira() {
    const analise = {
        custosPorInteracao: {
            planoElite: {
                custoMensal: 999,
                creditos: 90000,
                custoPorCredito: 0.0111,
                tokensMediaPorInteracao: 800,
                creditosUsadosPorInteracao: 72,
                custoPorInteracao: 0.80
            }
        },
        modeloTrial: {
            duracao: 3,
            interacoesPermitidas: 1,
            custoPorUsuario: 0.80,
            conversaoEsperada: 0.05
        },
        modeloPremium: {
            precoPorMes: 49.90,
            limitesDiarios: 2,
            limitesMensais: 60,
            custoMaximoIA: 48.00,
            margemBruta: 1.90,
            margemPercentual: 3.8
        },
        pacotesExtras: [
            {
                nome: '+10 interações',
                preco: 9.90,
                creditos: 10,
                custoIA: 8.00,
                lucro: 1.90,
                margemPercentual: 19.2
            },
            {
                nome: '+30 interações',
                preco: 19.90,
                creditos: 30,
                custoIA: 24.00,
                lucro: -4.10,
                margemPercentual: -20.6,
                recomendacao: 'Aumentar para R$ 29,90'
            },
            {
                nome: '+60 interações',
                preco: 29.90,
                creditos: 60,
                custoIA: 48.00,
                lucro: -18.10,
                margemPercentual: -60.5,
                recomendacao: 'Aumentar para R$ 59,90'
            }
        ],
        cenarios: {
            conservador: {
                usuariosTrial: 1000,
                conversaoPremium: 0.05,
                usuariosPremium: 50,
                receitaMensal: 2495,
                custoIATrial: 800,
                custoIAPremium: 2400,
                custoTotal: 3200,
                prejuizo: -705,
                observacao: 'PREJUÍZO - Ajustar preços'
            },
            realista: {
                usuariosTrial: 500,
                conversaoPremium: 0.08,
                usuariosPremium: 40,
                receitaMensal: 1996,
                custoIATrial: 400,
                custoIAPremium: 1920,
                custoTotal: 2320,
                prejuizo: -324,
                observacao: 'PREJUÍZO - Necessário extras'
            },
            otimista: {
                usuariosTrial: 300,
                conversaoPremium: 0.10,
                usuariosPremium: 30,
                receitaMensal: 1497,
                custoIATrial: 240,
                custoIAPremium: 1440,
                custoTotal: 1680,
                vendasExtras: 450,
                receitaTotal: 1947,
                lucro: 267,
                observacao: 'LUCRO com extras'
            }
        },
        recomendacoes: [
            {
                tipo: 'CRÍTICO',
                titulo: 'Ajustar Preços dos Pacotes Extras',
                descricao: 'Os pacotes de 30 e 60 créditos estão com prejuízo. Recomendações:',
                acoes: [
                    'Pacote +10: Manter R$ 9,90 (margem 19%)',
                    'Pacote +30: Aumentar para R$ 29,90 (margem 19%)',
                    'Pacote +60: Aumentar para R$ 59,90 (margem 19%)'
                ]
            },
            {
                tipo: 'IMPORTANTE',
                titulo: 'Reduzir Limite Mensal Premium',
                descricao: 'Limite de 60/mês está consumindo R$ 48 em IA, restando apenas R$ 1,90 de margem.',
                acoes: [
                    'Opção 1: Reduzir para 40 interações/mês (custo R$ 32, margem R$ 17,90)',
                    'Opção 2: Aumentar mensalidade para R$ 69,90 (margem R$ 21,90)',
                    'Opção 3: Manter e incentivar compra de extras'
                ]
            },
            {
                tipo: 'ESTRATÉGICO',
                titulo: 'Incentivar Compra de Extras',
                descricao: 'Extras com preços ajustados podem ser a principal fonte de lucro.',
                acoes: [
                    'Mostrar alertas quando usuário estiver próximo ao limite',
                    'Oferecer desconto no primeiro pacote extra',
                    'Criar bundles: "Premium + 30 extras" por R$ 69,90'
                ]
            },
            {
                tipo: 'OPERACIONAL',
                titulo: 'Controle Rigoroso do Trial',
                descricao: 'Cada usuário trial custa R$ 0,80. Com baixa conversão, pode gerar prejuízo.',
                acoes: [
                    'Limitar trial a apenas 1 interação (implementado)',
                    'Reduzir período de trial de 7 para 3 dias (implementado)',
                    'Coletar cartão já no cadastro do trial'
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold gradient-text">
                        Análise Financeira - Monetização com IA
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Portal da Espiritualidade - Modelo de Negócio e Rentabilidade
                    </p>
                </div>

                {/* Custos de IA */}
                <Card className="bg-white/90 backdrop-blur border-stone-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-purple-600" />
                            Custos de IA por Interação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-sm text-purple-700 mb-1">Plano Base44 Elite</div>
                                <div className="text-2xl font-bold text-purple-900">R$ 999/mês</div>
                                <div className="text-xs text-purple-600 mt-1">90.000 créditos mensais</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm text-blue-700 mb-1">Custo por Crédito</div>
                                <div className="text-2xl font-bold text-blue-900">R$ 0,0111</div>
                                <div className="text-xs text-blue-600 mt-1">R$ 999 ÷ 90.000</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="text-sm text-amber-700 mb-1">Custo por Interação</div>
                                <div className="text-2xl font-bold text-amber-900">R$ 0,80</div>
                                <div className="text-xs text-amber-600 mt-1">~800 tokens ≈ 72 créditos</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                            <p className="text-sm text-stone-700">
                                💡 <strong>Cálculo:</strong> Cada conversa com o Guia Espiritual consome aproximadamente 800 tokens 
                                (prompt + resposta). No plano Elite, isso equivale a ~72 créditos, custando R$ 0,80 por interação.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Modelo Trial */}
                <Card className="bg-white/90 backdrop-blur border-stone-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-amber-600" />
                            Modelo Trial (3 dias)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="text-sm text-amber-700 mb-1">Duração</div>
                                <div className="text-2xl font-bold text-amber-900">3 dias</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="text-sm text-amber-700 mb-1">Interações</div>
                                <div className="text-2xl font-bold text-amber-900">1 total</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="text-sm text-amber-700 mb-1">Custo/usuário</div>
                                <div className="text-2xl font-bold text-amber-900">R$ 0,80</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="text-sm text-amber-700 mb-1">Conversão</div>
                                <div className="text-2xl font-bold text-amber-900">5%</div>
                            </div>
                        </div>
                        <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                            <p className="text-sm text-amber-900">
                                ⚠️ <strong>Atenção:</strong> Se 1000 usuários testarem e apenas 5% converterem, você terá um custo de 
                                R$ 800 em IA para gerar R$ 2.495 em receita (50 × R$ 49,90). Parece bom, mas considere o custo mensal desses usuários...
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Modelo Premium */}
                <Card className="bg-white/90 backdrop-blur border-stone-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-green-600" />
                            Modelo Premium (R$ 49,90/mês)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm text-green-700 mb-1">Mensalidade</div>
                                <div className="text-2xl font-bold text-green-900">R$ 49,90</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm text-blue-700 mb-1">Limite Diário</div>
                                <div className="text-2xl font-bold text-blue-900">2 msgs</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm text-blue-700 mb-1">Limite Mensal</div>
                                <div className="text-2xl font-bold text-blue-900">60 msgs</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="text-sm text-red-700 mb-1">Custo Máx IA</div>
                                <div className="text-2xl font-bold text-red-900">R$ 48,00</div>
                                <div className="text-xs text-red-600">60 × R$ 0,80</div>
                            </div>
                        </div>
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-red-700 mb-1">Margem Bruta Mensal</div>
                                    <div className="text-3xl font-bold text-red-900">R$ 1,90</div>
                                    <div className="text-sm text-red-700 mt-1">Margem de apenas 3,8%</div>
                                </div>
                                <AlertCircle className="w-16 h-16 text-red-600" />
                            </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                            <p className="text-sm text-amber-900">
                                ⚠️ <strong>PROBLEMA:</strong> Se todos os usuários Premium usarem o limite máximo de 60 mensagens/mês, 
                                a margem de lucro é de apenas R$ 1,90 por usuário. Isso é insustentável para escalar o negócio.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pacotes Extras */}
                <Card className="bg-white/90 backdrop-blur border-stone-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                            Pacotes de Créditos Extras
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {analise.pacotesExtras.map((pacote, idx) => (
                                <div key={idx} className={`border-2 rounded-lg p-4 ${
                                    pacote.lucro > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-lg text-stone-800">{pacote.nome}</div>
                                            <Badge className={pacote.lucro > 0 ? 'bg-green-600' : 'bg-red-600'}>
                                                {pacote.lucro > 0 ? 'LUCRO' : 'PREJUÍZO'}
                                            </Badge>
                                        </div>
                                        <div className="text-2xl font-bold text-stone-800">
                                            R$ {pacote.preco.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <div className="text-stone-600">Créditos</div>
                                            <div className="font-semibold">{pacote.creditos}</div>
                                        </div>
                                        <div>
                                            <div className="text-stone-600">Custo IA</div>
                                            <div className="font-semibold">R$ {pacote.custoIA.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-stone-600">Lucro</div>
                                            <div className={`font-semibold ${pacote.lucro > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                R$ {pacote.lucro.toFixed(2)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-stone-600">Margem</div>
                                            <div className={`font-semibold ${pacote.lucro > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {pacote.margemPercentual.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    {pacote.recomendacao && (
                                        <div className="mt-2 bg-white/80 rounded p-2 text-sm text-amber-900 border border-amber-300">
                                            💡 <strong>Recomendação:</strong> {pacote.recomendacao}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cenários */}
                <Card className="bg-white/90 backdrop-blur border-stone-200">
                    <CardHeader>
                        <CardTitle>Projeções de Receita vs Custo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(analise.cenarios).map(([nome, cenario]) => (
                            <div key={nome} className={`border-2 rounded-lg p-4 ${
                                cenario.lucro && cenario.lucro > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                            }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-xl capitalize text-stone-800">{nome}</h3>
                                    <Badge className={cenario.lucro && cenario.lucro > 0 ? 'bg-green-600' : 'bg-red-600'}>
                                        {cenario.observacao}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                    <div>
                                        <div className="text-stone-600">Trials/mês</div>
                                        <div className="font-semibold">{cenario.usuariosTrial}</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Conversão</div>
                                        <div className="font-semibold">{(cenario.conversaoPremium * 100).toFixed(0)}%</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Usuários Premium</div>
                                        <div className="font-semibold">{cenario.usuariosPremium}</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Receita Assinaturas</div>
                                        <div className="font-semibold text-green-700">R$ {cenario.receitaMensal.toFixed(0)}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <div className="text-stone-600">Custo IA Trial</div>
                                        <div className="font-semibold text-red-700">R$ {cenario.custoIATrial.toFixed(0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Custo IA Premium</div>
                                        <div className="font-semibold text-red-700">R$ {cenario.custoIAPremium.toFixed(0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Custo Total IA</div>
                                        <div className="font-semibold text-red-700">R$ {cenario.custoTotal.toFixed(0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-stone-600">Resultado</div>
                                        <div className={`font-bold text-lg ${(cenario.lucro || cenario.prejuizo) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            R$ {((cenario.lucro || cenario.prejuizo)).toFixed(0)}
                                        </div>
                                    </div>
                                </div>
                                {cenario.vendasExtras && (
                                    <div className="mt-3 bg-purple-50 border border-purple-300 rounded p-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-purple-900">+ Vendas de Extras (estimado)</span>
                                            <span className="font-bold text-purple-900">R$ {cenario.vendasExtras.toFixed(0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-purple-900 font-bold">= Receita Total</span>
                                            <span className="font-bold text-purple-900">R$ {cenario.receitaTotal.toFixed(0)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recomendações */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                            <CheckCircle2 className="w-6 h-6" />
                            Recomendações Estratégicas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analise.recomendacoes.map((rec, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border-2 border-purple-200">
                                <div className="flex items-start gap-3">
                                    <Badge className={
                                        rec.tipo === 'CRÍTICO' ? 'bg-red-600' :
                                        rec.tipo === 'IMPORTANTE' ? 'bg-amber-600' :
                                        rec.tipo === 'ESTRATÉGICO' ? 'bg-purple-600' :
                                        'bg-blue-600'
                                    }>
                                        {rec.tipo}
                                    </Badge>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-stone-800 mb-2">{rec.titulo}</h4>
                                        <p className="text-stone-700 text-sm mb-3">{rec.descricao}</p>
                                        <div className="space-y-2">
                                            {rec.acoes.map((acao, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-stone-700">{acao}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Conclusão */}
                <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
                    <CardContent className="p-8 text-center space-y-4">
                        <h2 className="text-3xl font-bold">Conclusão e Próximos Passos</h2>
                        <div className="max-w-3xl mx-auto space-y-3 text-white/90">
                            <p className="text-lg">
                                <strong>1. Ajustar Preços Imediatamente:</strong> Os pacotes extras precisam ser aumentados para garantir lucratividade (margem mínima de 15-20%).
                            </p>
                            <p className="text-lg">
                                <strong>2. Reduzir Limite Mensal ou Aumentar Mensalidade:</strong> Com limite de 60 msgs/mês, a margem é de apenas 3,8%. Opções: reduzir para 40 msgs ou aumentar para R$ 69,90/mês.
                            </p>
                            <p className="text-lg">
                                <strong>3. Estratégia de Extras:</strong> Com preços corrigidos, extras podem ser a principal fonte de lucro. Incentivar compra através de alertas e promoções.
                            </p>
                            <p className="text-lg">
                                <strong>4. Controlar Trial:</strong> Manter trial em 3 dias e 1 interação. Considerar coletar cartão no cadastro para reduzir abuse.
                            </p>
                            <p className="text-xl font-bold mt-4">
                                🎯 Meta: Margem de lucro de 40-50% por usuário através da combinação de mensalidade + vendas de extras.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}