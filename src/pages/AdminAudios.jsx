
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2, Music, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminAudios() {
    const [uploading, setUploading] = useState({});
    const [playingAudio, setPlayingAudio] = useState(null); // New state for managing audio playback
    const queryClient = useQueryClient();

    const { data: practices } = useQuery({
        queryKey: ['practices'],
        queryFn: () => base44.entities.Practice.list(),
        initialData: []
    });

    const updatePracticeMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Practice.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['practices'] });
        }
    });

    const handlePracticeAudioUpload = async (practiceId, file) => {
        setUploading(prev => ({ ...prev, [practiceId]: true }));
        
        try {
            // Criar elemento de áudio temporário para obter duração
            const audioElement = document.createElement('audio');
            const fileUrl = URL.createObjectURL(file);
            audioElement.src = fileUrl;
            
            // Aguardar o carregamento dos metadados
            await new Promise((resolve, reject) => {
                audioElement.addEventListener('loadedmetadata', resolve);
                audioElement.addEventListener('error', reject);
            });
            
            const durationInMinutes = Math.round(audioElement.duration / 60);
            URL.revokeObjectURL(fileUrl);
            
            // Upload do arquivo
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            
            // Atualizar prática com URL do áudio e duração
            await updatePracticeMutation.mutateAsync({
                id: practiceId,
                data: { 
                    audio_url: file_url,
                    duracao: durationInMinutes
                }
            });
            
            alert(`Áudio enviado com sucesso! Duração ajustada para ${durationInMinutes} minutos.`);
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            alert('Erro ao enviar áudio. Tente novamente.');
        } finally {
            setUploading(prev => ({ ...prev, [practiceId]: false }));
        }
    };

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        Gerenciar Áudios das Práticas
                    </h1>
                    <p className="text-stone-600">
                        Faça upload dos arquivos MP3 profissionais para cada prática
                    </p>
                </div>

                <Alert className="bg-rose-50 border-rose-200">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <AlertDescription className="text-rose-900 space-y-3">
                        <p className="font-semibold text-lg">⚠️ Importante sobre os Áudios Atuais</p>
                        <p>
                            O sistema está usando <strong>voz sintética do navegador como fallback</strong>, que tem várias limitações:
                        </p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Pronúncia robótica e sem emoção</li>
                            <li>Palavras em português com grafia inglesa são pronunciadas errado</li>
                            <li>Sem música de fundo relaxante</li>
                            <li>Sem pausas adequadas para meditação</li>
                            <li>O áudio pode ser cortado antes do final</li>
                            <li>Não suporta pause/resume corretamente</li>
                        </ul>
                        <p className="font-semibold">
                            Para uma experiência profissional, você PRECISA fazer upload de arquivos MP3 criados com:
                        </p>
                    </AlertDescription>
                </Alert>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                            <Music className="w-6 h-6" />
                            Como Criar Áudios Profissionais para Meditação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-sm text-blue-900">
                        <div>
                            <h3 className="font-bold text-lg mb-3">🎯 Opção 1: ElevenLabs (Recomendado - Qualidade Profissional)</h3>
                            <div className="space-y-2 ml-4">
                                <p><strong>Vantagens:</strong> Vozes ultra realistas com emoção, pausas naturais</p>
                                <p><strong>Custo:</strong> 10.000 caracteres grátis/mês, depois $5-22/mês</p>
                                <p><strong>Passo a passo:</strong></p>
                                <ol className="list-decimal ml-6 space-y-1">
                                    <li>Acesse <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">elevenlabs.io</a></li>
                                    <li>Cadastre-se e escolha voz em português (recomendo "Camila" ou "Rodrigo")</li>
                                    <li>Cole o texto da prática</li>
                                    <li>Adicione pausas usando "..." ou "[pausa 3s]"</li>
                                    <li>Gere e baixe o MP3</li>
                                </ol>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">🎵 Adicionando Música de Fundo</h3>
                            <div className="space-y-2 ml-4">
                                <p><strong>Opção A - Online (Grátis):</strong> Use <a href="https://www.kapwing.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Kapwing.com</a></p>
                                <ol className="list-decimal ml-6 space-y-1">
                                    <li>Faça upload do áudio da voz</li>
                                    <li>Adicione música relaxante de fundo (use músicas royalty-free)</li>
                                    <li>Ajuste volume da música para 20-30% (bem baixo)</li>
                                    <li>Exporte como MP3</li>
                                </ol>
                                
                                <p className="mt-3"><strong>Opção B - Software (Profissional):</strong> Audacity (grátis) ou Adobe Audition</p>
                                <ol className="list-decimal ml-6 space-y-1">
                                    <li>Importe o áudio da voz</li>
                                    <li>Adicione trilha de música</li>
                                    <li>Reduza volume da música (-20dB)</li>
                                    <li>Exporte MP3 em 192kbps</li>
                                </ol>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">🎼 Onde Encontrar Música Relaxante</h3>
                            <ul className="list-disc ml-6 space-y-1">
                                <li><a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Pixabay Music</a> - 100% gratuito</li>
                                <li><a href="https://www.bensound.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Bensound</a> - Música ambiente</li>
                                <li><a href="https://freemusicarchive.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Free Music Archive</a></li>
                            </ul>
                            <p className="mt-2 text-xs text-blue-700">Procure por: "meditation", "ambient", "zen", "spa", "relaxing"</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">⏱️ Opção 2: Google Cloud Text-to-Speech</h3>
                            <div className="space-y-2 ml-4">
                                <p><strong>Vantagens:</strong> Vozes neurais excelentes, muito barato</p>
                                <p><strong>Custo:</strong> ~$4 por 1 milhão de caracteres</p>
                                <p><a href="https://cloud.google.com/text-to-speech" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                                    Acessar Google Cloud TTS <ExternalLink className="w-3 h-3" />
                                </a></p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">🎙️ Opção 3: Locutor Profissional</h3>
                            <div className="space-y-2 ml-4">
                                <p><strong>Vantagens:</strong> Máxima qualidade e naturalidade</p>
                                <p><strong>Custo:</strong> R$50-200 por áudio</p>
                                <p><strong>Onde contratar:</strong></p>
                                <ul className="list-disc ml-6">
                                    <li><a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Fiverr.com</a> (internacional)</li>
                                    <li><a href="https://www.99freelas.com.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">99Freelas.com.br</a> (brasileiro)</li>
                                </ul>
                                <p className="text-xs mt-1">Procure por: "locutor meditação", "voz para hipnose", "narração relaxante"</p>
                            </div>
                        </div>

                        <Alert className="bg-green-50 border-green-300">
                            <AlertDescription className="text-green-900">
                                <p className="font-semibold mb-2">💡 Dica de Ouro:</p>
                                <p>Para melhores resultados, combine ElevenLabs (voz) + Kapwing (música de fundo). 
                                Total de tempo: ~10 minutos por áudio. Resultado: qualidade profissional!</p>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-stone-800">Upload dos Áudios MP3</h2>
                    <p className="text-stone-600 text-sm">
                        Após criar os arquivos MP3 com as instruções acima, faça upload aqui:
                    </p>
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-900">
                            <p className="font-semibold mb-1">✨ Recurso Automático:</p>
                            <p className="text-sm">Quando você fizer upload de um arquivo MP3, a duração da prática será automaticamente 
                            ajustada com base no tempo real do áudio!</p>
                        </AlertDescription>
                    </Alert>
                    
                    {practices.map((practice) => (
                        <Card key={practice.id} className="bg-white/80 backdrop-blur border-stone-200">
                            <CardContent className="p-6">
                                <div className="space-y-4"> {/* Added a div for consistent spacing */}
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-[250px]">
                                            <h3 className="text-lg font-semibold text-stone-800 mb-1">
                                                {practice.titulo}
                                            </h3>
                                            <p className="text-sm text-stone-600 mb-2">
                                                {practice.descricao}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                <Badge variant={practice.nivel === 'premium' ? 'default' : 'secondary'}>
                                                    {practice.nivel}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {practice.duracao} min
                                                </Badge>
                                            </div>
                                            
                                            {practice.audio_url && (
                                                <div className="mt-3 flex items-center gap-2 text-green-600">
                                                    <Check className="w-4 h-4" />
                                                    <span className="text-sm">Áudio carregado</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                type="file"
                                                accept="audio/mp3,audio/mpeg"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handlePracticeAudioUpload(practice.id, file);
                                                    }
                                                }}
                                                disabled={uploading[practice.id]}
                                                className="w-64"
                                            />
                                            {uploading[practice.id] && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Enviando e ajustando duração...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* New audio player section */}
                                    {(practice.audio_url || practice.audio_texto) && (
                                        <div className="pt-4 border-t border-stone-200">
                                            <Button
                                                onClick={() => {
                                                    if (window.speechSynthesis.speaking) {
                                                        window.speechSynthesis.cancel(); // Stop any ongoing speech synthesis
                                                    }
                                                    setPlayingAudio(playingAudio === practice.id ? null : practice.id);
                                                }}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Music className="w-4 h-4 mr-2" />
                                                {playingAudio === practice.id ? 'Fechar Player' : 'Ouvir Áudio'}
                                            </Button>
                                            
                                            {playingAudio === practice.id && (
                                                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                                    {practice.audio_url ? (
                                                        <div className="space-y-2">
                                                            <audio 
                                                                controls 
                                                                className="w-full"
                                                                src={practice.audio_url}
                                                            >
                                                                Seu navegador não suporta o elemento de áudio.
                                                            </audio>
                                                            <p className="text-xs text-stone-600">
                                                                Áudio profissional carregado
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <p className="text-sm text-amber-700 font-semibold">
                                                                ⚠️ Voz Sintética (Preview)
                                                            </p>
                                                            <Button
                                                                onClick={() => {
                                                                    if (window.speechSynthesis.speaking) {
                                                                        window.speechSynthesis.cancel();
                                                                    }
                                                                    if (practice.audio_texto) {
                                                                        const utterance = new SpeechSynthesisUtterance(practice.audio_texto);
                                                                        utterance.lang = 'pt-BR';
                                                                        utterance.rate = 0.85; // Slightly slower for better comprehension
                                                                        window.speechSynthesis.speak(utterance);
                                                                    }
                                                                }}
                                                                variant="secondary"
                                                                size="sm"
                                                            >
                                                                ▶️ Reproduzir com Voz Sintética
                                                            </Button>
                                                            <p className="text-xs text-amber-600">
                                                                Faça upload de um MP3 profissional para melhor qualidade
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-stone-800">Textos para Gerar Áudios</h2>
                    <p className="text-stone-600 text-sm">
                        Copie os textos abaixo e cole no gerador de áudio de sua escolha
                    </p>
                    
                    {practices.map((practice) => (
                        <Card key={practice.id} className="bg-stone-50 border-stone-200">
                            <CardHeader>
                                <CardTitle className="text-lg">{practice.titulo}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-white p-4 rounded border border-stone-200 max-h-48 overflow-y-auto">
                                    <pre className="text-sm whitespace-pre-wrap font-sans">
                                        {practice.audio_texto}
                                    </pre>
                                </div>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(practice.audio_texto);
                                        alert('Texto copiado!');
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                >
                                    Copiar Texto
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

