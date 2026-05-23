'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';

type Mode = 'idle' | 'camera' | 'preview' | 'uploading' | 'done' | 'error';

const STEPS = [
  { icon: 'upload', label: 'Enviando imagem…' },
  { icon: 'document_scanner', label: 'Google Vision lendo o texto…' },
  { icon: 'auto_awesome', label: 'IA extraindo valor e estabelecimento…' },
  { icon: 'check_circle', label: 'Salvando despesa…' },
];

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<Mode>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMode('camera');
    } catch {
      setError('Câmera não acessível. Verifique permissões ou use o upload de imagem.');
    }
  }

  function captureFromCamera() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (b) => {
        if (!b) return;
        setBlob(b);
        setPreview(URL.createObjectURL(b));
        stopStream();
        setMode('preview');
      },
      'image/jpeg',
      0.92,
    );
  }

  function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato não suportado. Envie JPG, PNG ou WEBP.');
      return;
    }
    setBlob(file);
    setPreview(URL.createObjectURL(file));
    stopStream();
    setMode('preview');
    setError(null);
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setBlob(null);
    setStep(0);
    setError(null);
    setMode('idle');
  }

  async function upload() {
    if (!blob) return;
    setMode('uploading');
    setStep(0);
    setError(null);

    // Simula progressão visual enquanto aguarda o servidor
    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3500);

    try {
      const fd = new FormData();
      fd.append('file', blob, blob instanceof File ? blob.name : 'capture.jpg');

      const res = await fetch('/api/receipts', { method: 'POST', body: fd });
      const data = await res.json();

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!res.ok) throw new Error(data.error ?? 'Falha ao processar');
      setStep(3);
      setMode('done');
      router.push(`/history/${data.expense.id}`);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setError(err instanceof Error ? err.message : 'Erro ao enviar');
      setMode('error');
    }
  }

  const currentStep = STEPS[step];

  return (
    <div className="animate-fade-in pb-20">
      <section className="mb-5">
        <h1 className="font-sora text-headline-md md:text-headline-lg">Escanear recibo</h1>
        <p className="text-on-surface-variant mt-1">
          Use a câmera ou envie uma imagem — o Google Vision + IA cuidam do resto.
        </p>
      </section>

      {/* Viewport */}
      <GlassCard
        radius="4xl"
        className="relative overflow-hidden bg-black/90"
        style={{ aspectRatio: '4/3' }}
      >
        {mode === 'camera' && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.85)' }}
          />
        )}

        {(mode === 'preview' || mode === 'uploading' || mode === 'done' || mode === 'error') &&
          preview && (
            <img
              src={preview}
              alt="Recibo"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              style={{
                filter: mode === 'uploading' ? 'brightness(0.55) saturate(0.5)' : 'brightness(0.85)',
              }}
            />
          )}

        {mode === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/70">
              <Icon name="document_scanner" size={64} className="mb-3 inline-block" />
              <p className="font-sora text-xl">Pronto para escanear</p>
              <p className="text-sm text-white/60 mt-1">Escolha um modo abaixo.</p>
            </div>
          </div>
        )}

        {/* Header overlay */}
        {mode !== 'idle' && (
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={reset}
              disabled={mode === 'uploading'}
              className="w-11 h-11 rounded-full glass-strong text-primary flex items-center justify-center hover:scale-105 transition disabled:opacity-40"
              aria-label="Fechar"
            >
              <Icon name="close" />
            </button>
            <div className="glass-strong rounded-full px-3 py-1.5 flex items-center gap-2">
              <span
                className={clsx(
                  'w-2 h-2 rounded-full',
                  mode === 'uploading' ? 'bg-tertiary animate-pulse' : 'bg-primary animate-pulse',
                )}
              />
              <span className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface">
                {mode === 'camera' ? 'Câmera ativa'
                  : mode === 'preview' ? 'Pronto para enviar'
                  : mode === 'uploading' ? 'Processando com IA…'
                  : mode === 'done' ? 'Concluído'
                  : 'Erro'}
              </span>
            </div>
          </div>
        )}

        {/* Scanning frame */}
        {(mode === 'camera' || mode === 'preview') && (
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="relative w-full max-w-xs aspect-[3/4] scanning-frame rounded-4xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-2xl" />
            </div>
          </div>
        )}

        {/* Uploading progress overlay */}
        {mode === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 px-8">
            <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center">
              <Icon name={currentStep.icon} className="text-primary animate-pulse-slow" size={36} />
            </div>
            <div className="text-center">
              <p className="font-sora text-xl text-white font-semibold">{currentStep.label}</p>
              <p className="text-white/60 text-sm mt-1">
                Etapa {step + 1} de {STEPS.length}
              </p>
            </div>
            <div className="w-full max-w-xs bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-700"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom bar */}
        {mode !== 'idle' && mode !== 'uploading' && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center px-4 z-10">
            <div className="glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 max-w-sm">
              <Icon
                name={mode === 'error' ? 'error' : mode === 'done' ? 'check_circle' : 'info'}
                className={clsx('text-primary', mode === 'error' && 'text-error')}
                size={18}
              />
              <p className="text-sm text-on-surface-variant">
                {error ?? (mode === 'camera'
                  ? 'Posicione o recibo no centro'
                  : mode === 'preview'
                    ? 'Imagem pronta — toque em Analisar'
                    : 'Despesa salva com sucesso!')}
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-5">
        {mode === 'idle' && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            <button
              onClick={startCamera}
              className="flex flex-col items-center gap-2 p-5 rounded-3xl glass-strong hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-on flex items-center justify-center shadow-liquid">
                <Icon name="camera_enhance" filled />
              </div>
              <p className="font-sora font-semibold">Câmera ao vivo</p>
              <p className="text-xs text-on-surface-variant text-center">Captura em tempo real</p>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-5 rounded-3xl glass-strong hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary-on-container flex items-center justify-center">
                <Icon name="image" filled />
              </div>
              <p className="font-sora font-semibold">Enviar imagem</p>
              <p className="text-xs text-on-surface-variant text-center">JPG, PNG ou WEBP</p>
            </button>
          </div>
        )}

        {mode === 'camera' && (
          <div className="flex items-center gap-12">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition"
            >
              <Icon name="image" size={28} />
              <span className="font-grotesk text-[10px] uppercase tracking-wider">Galeria</span>
            </button>
            <button
              onClick={captureFromCamera}
              className="relative w-20 h-20 rounded-full bg-white p-1 shadow-shutter hover:scale-105 active:scale-95 transition"
              aria-label="Capturar"
            >
              <span className="absolute -inset-4 bg-primary/20 rounded-full blur-xl" />
              <span className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-primary-container to-primary border-2 border-primary/20">
                <Icon name="camera" filled className="text-white" size={32} />
              </span>
            </button>
            <button
              onClick={reset}
              className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-error transition"
            >
              <Icon name="cancel" size={28} />
              <span className="font-grotesk text-[10px] uppercase tracking-wider">Cancelar</span>
            </button>
          </div>
        )}

        {mode === 'preview' && (
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="px-5 py-3 rounded-full glass-strong text-on-surface-variant hover:text-error transition"
            >
              Tirar outra
            </button>
            <button
              onClick={upload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-on font-semibold shadow-liquid-strong hover:scale-[1.03] active:scale-95 transition"
            >
              <Icon name="auto_awesome" filled size={20} />
              Analisar com IA
            </button>
          </div>
        )}

        {mode === 'error' && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-on font-semibold"
          >
            <Icon name="refresh" size={18} /> Tentar de novo
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFilePicked}
        />
      </div>

      {/* Trust badge */}
      <div className="mt-8 mx-auto max-w-md">
        <GlassCard radius="3xl" className="p-4 flex items-start gap-3">
          <Icon name="security" className="text-primary mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-sm">Como funciona</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Sua imagem é enviada ao servidor, processada pelo{' '}
              <strong>Google Cloud Vision</strong> para extrair o texto, e os dados estruturados
              (valor, estabelecimento, data) são salvos no seu banco Supabase. Nenhuma imagem é
              compartilhada com terceiros além do Google Vision.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
