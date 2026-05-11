import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Volume2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AudioPlayer({ audioUrl, texto, titulo, practiceId }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const utteranceRef = useRef(null);

    const hasRealAudio = audioUrl && audioUrl.trim() !== '';

    useEffect(() => {
        if (hasRealAudio && audioRef.current) {
            const audio = audioRef.current;
            
            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };
            
            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };
            
            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            const handlePlay = () => {
                // Pausar outros áudios quando este começar a tocar
                document.querySelectorAll('audio').forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                    }
                });
            };
            
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('play', handlePlay);
            
            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('play', handlePlay);
                audio.pause();
            };
        }
    }, [hasRealAudio, audioUrl]);

    const handlePlayPause = () => {
        if (hasRealAudio && audioRef.current) {
            // Áudio real - suporta pause e resume
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                // Pausar todos os outros áudios antes de tocar este
                document.querySelectorAll('audio').forEach(otherAudio => {
                    if (otherAudio !== audioRef.current && !otherAudio.paused) {
                        otherAudio.pause();
                    }
                });
                
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            // Fallback para text-to-speech (não suporta pause/resume adequadamente)
            if (isPlaying) {
                window.speechSynthesis?.cancel();
                setIsPlaying(false);
            } else {
                // Parar qualquer outra síntese em andamento
                window.speechSynthesis?.cancel();
                
                if ('speechSynthesis' in window && texto) {
                    const utterance = new SpeechSynthesisUtterance(texto);
                    utterance.lang = 'pt-BR';
                    utterance.rate = 0.85;
                    utterance.pitch = 1;
                    
                    utterance.onstart = () => setIsPlaying(true);
                    utterance.onend = () => setIsPlaying(false);
                    utterance.onerror = () => setIsPlaying(false);
                    
                    utteranceRef.current = utterance;
                    window.speechSynthesis.speak(utterance);
                }
            }
        }
    };

    const handleStop = () => {
        if (hasRealAudio && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
        } else {
            window.speechSynthesis?.cancel();
        }
        setIsPlaying(false);
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-700">
                    <Volume2 className="w-6 h-6" />
                    <div>
                        <h3 className="font-semibold text-lg">Áudio Guiado</h3>
                        {!hasRealAudio && (
                            <p className="text-xs text-amber-600">
                                Usando voz sintética do navegador (limitada)
                            </p>
                        )}
                    </div>
                </div>

                {hasRealAudio && (
                    <>
                        <audio ref={audioRef} src={audioUrl} preload="metadata" />
                        
                        <div className="space-y-2">
                            <div className="w-full bg-emerald-200 rounded-full h-2">
                                <div
                                    className="bg-emerald-600 h-2 rounded-full transition-all"
                                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-stone-600">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex gap-3">
                    <Button
                        onClick={handlePlayPause}
                        className={`flex-1 ${
                            isPlaying
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                        }`}
                        size="lg"
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-5 h-5 mr-2" />
                                Pausar
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 mr-2" />
                                {currentTime > 0 && hasRealAudio ? 'Continuar' : 'Reproduzir Prática'}
                            </>
                        )}
                    </Button>
                    
                    <Button
                        onClick={handleStop}
                        variant="outline"
                        size="lg"
                        className="border-stone-300 hover:bg-stone-100"
                    >
                        <Square className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">
                    Encontre um lugar tranquilo, use fones de ouvido se possível, e deixe-se guiar por esta prática transformadora.
                </p>
            </div>

            {!hasRealAudio && (
                <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 text-sm">
                        <strong>Áudio Provisório:</strong> Esta prática está usando voz sintética do navegador 
                        que não suporta pause/resume adequadamente e pode ter pronúncia incorreta. 
                        Para uma experiência completa com locução profissional e música de fundo relaxante,
                        faça upload do arquivo MP3 através do painel administrativo.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}