import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, LogOut, Sparkles, BookOpen, MessageCircle, Heart, Upload, Camera, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressCard from '../components/ProgressCard';

export default function Profile() {
    const queryClient = useQueryClient();
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        initialData: null
    });

    const isPremium = user?.tipo_assinatura === 'premium';

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadingPhoto(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            await base44.auth.updateMe({ foto_perfil: file_url });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        } catch (error) {
            alert('Erro ao fazer upload da foto');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            // Aqui você implementaria a lógica real de mudança de senha
            // Por enquanto apenas simula
            await base44.auth.updateMe({ 
                password_changed_at: new Date().toISOString() 
            });
            
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            setTimeout(() => {
                setChangingPassword(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (error) {
            alert('Erro ao alterar senha');
        }
    };

    const cancelSubscriptionMutation = useMutation({
        mutationFn: async () => {
            await base44.auth.updateMe({
                tipo_assinatura: 'free',
                subscription_status: 'canceled'
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            alert('Assinatura cancelada com sucesso.');
        }
    });

    const handleLogout = () => {
        base44.auth.logout();
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
                        Seu Perfil Espiritual
                    </h1>
                    <p className="text-stone-600">
                        Acompanhe sua jornada de transformação
                    </p>
                </motion.div>

                <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Informações Pessoais</span>
                            {isPremium && (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <Crown className="w-5 h-5" />
                                    <span className="text-sm font-semibold">Membro Premium</span>
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Foto de Perfil */}
                        <div className="flex flex-col items-center gap-4 pb-4 border-b border-stone-200">
                            <div className="relative">
                                {user?.foto_perfil ? (
                                    <img 
                                        src={user.foto_perfil} 
                                        alt="Foto de perfil" 
                                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <label 
                                    htmlFor="photo-upload" 
                                    className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                    <input 
                                        id="photo-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={uploadingPhoto}
                                    />
                                </label>
                            </div>
                            {uploadingPhoto && (
                                <p className="text-sm text-amber-600">Enviando foto...</p>
                            )}
                            <p className="text-xs text-stone-500 text-center">
                                Clique no ícone da câmera para alterar sua foto
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-600">Nome</p>
                            <p className="text-lg font-semibold text-stone-800">
                                {user?.full_name || 'Não informado'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-stone-600">Email</p>
                            <p className="text-lg font-semibold text-stone-800">
                                {user?.email}
                            </p>
                        </div>
                        {isPremium && (
                            <div className="pt-4 border-t border-stone-100">
                                <h4 className="font-semibold text-stone-800 mb-2">Sua Assinatura</h4>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="text-sm text-stone-600">
                                        <p>Status: <span className="text-green-600 font-medium">Ativa (Período de Teste)</span></p>
                                        <p>Início: {user?.subscription_start_date}</p>
                                        <p>Fim do Teste: {user?.trial_ends_at}</p>
                                        <p>Cartão: **** **** **** {user?.card_last4}</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            if (window.confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos benefícios premium.')) {
                                                cancelSubscriptionMutation.mutate();
                                            }
                                        }}
                                        disabled={cancelSubscriptionMutation.isPending}
                                        className="text-stone-500 hover:text-red-600 hover:bg-red-50 border-stone-300"
                                    >
                                        {cancelSubscriptionMutation.isPending ? 'Cancelando...' : 'Cancelar Assinatura'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {user && (
                    <ProgressCard
                        pontosEspirituais={user.pontos_espirituais || 0}
                        diasConsecutivos={user.dias_consecutivos || 0}
                        nivel={user.nivel_espiritual || 'iniciante'}
                    />
                )}

                <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                    <CardHeader>
                        <CardTitle>Suas Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <p className="text-sm text-stone-600">Práticas</p>
                                </div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {user?.praticas_completadas || 0}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm text-stone-600">Artigos</p>
                                </div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {user?.artigos_lidos || 0}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageCircle className="w-5 h-5 text-rose-600" />
                                    <p className="text-sm text-stone-600">Conversas</p>
                                </div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {user?.mensagens_guia || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {!isPremium && (
                    <Card className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white border-0 shadow-xl">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Crown className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">Torne-se Premium</h2>
                            </div>
                            <p className="text-white/90 leading-relaxed">
                                Desbloqueie todo o potencial do Portal da Espiritualidade com acesso ilimitado a práticas guiadas, toda biblioteca de sabedoria, e 18 créditos mensais para o Guia Espiritual (IA).
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    <span>Práticas ilimitadas e exclusivas</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>18 créditos mensais para o Guia Espiritual</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Biblioteca completa de artigos</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Diário e Desafios ilimitados</span>
                                </li>
                            </ul>
                            <div className="space-y-3">
                                <Button className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold text-lg py-6">
                                    Iniciar Teste Grátis de 7 Dias
                                </Button>
                                <p className="text-center text-white/80 text-sm">
                                    Apenas R$ 29,90/mês após o teste • Cancele quando quiser
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Segurança e Senha */}
                <Card className="bg-white/80 backdrop-blur border-stone-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!changingPassword ? (
                            <Button
                                onClick={() => setChangingPassword(true)}
                                variant="outline"
                                className="w-full"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Alterar Senha
                            </Button>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {passwordSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                                        <Check className="w-5 h-5" />
                                        <span>Senha alterada com sucesso!</span>
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Senha Atual</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        placeholder="Digite sua senha atual"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Nova Senha</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Digite novamente"
                                        minLength={6}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setChangingPassword(false);
                                            setCurrentPassword('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                        }}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                                    >
                                        Salvar Senha
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur border-stone-200">
                    <CardContent className="p-6">
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair da Conta
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}