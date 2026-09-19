import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Store,
  RefreshCw,
  Sparkles,
  Flashlight,
  Camera,
  Keyboard,
  Upload,
  X,
  BadgeCheck,
  Link2,
  Loader2,
  QrCode,
} from 'lucide-react';
import { toDanfeUrl, shrink } from '../utils/format';

export default function BiparNota({ onScan, showToast, onSync, syncing }) {
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const cameraRef = useRef(null);
  const onScanRef = useRef(onScan);

  const [camError, setCamError] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    const s = scannerRef.current;
    if (s) {
      try {
        if (s.isScanning) await s.stop();
      } catch {
        /* noop */
      }
    }
  }, []);

  const startScanner = useCallback(async (deviceId) => {
    const s = scannerRef.current;
    if (!s) return;
    cameraRef.current = deviceId || null;
    setCamError(false);
    setInitializing(true);
    try {
      await s.start(
        deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' },
        {
          fps: 12,
          qrbox: (vw, vh) => ({
            width: Math.min(0.75 * vw, 0.75 * vh, 260),
            height: Math.min(0.75 * vw, 0.75 * vh, 260),
          }),
        },
        (text) => {
          handleScan(text);
        },
        () => {
          /* ignore individual frame failures */
        }
      );
      setInitializing(false);
    } catch {
      setInitializing(false);
      setCamError(true);
    }
  }, []);

  const handleScan = useCallback(
    async (raw) => {
      if (processingRef.current) return;
      const url = toDanfeUrl(raw);
      if (!url) return;
      processingRef.current = true;
      setProcessing(true);
      setLastResult({
        url,
        at: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
      try {
        await stopScanner();
      } catch {
        /* noop */
      }
      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
      showToast('Nota fiscal identificada! Enviando para a fila...');
      const ok = await onScanRef.current(url);
      if (!ok) {
        processingRef.current = false;
        setProcessing(false);
        startScanner(cameraRef.current);
      }
    },
    [startScanner, stopScanner, showToast]
  );

  useEffect(() => {
    let disposed = false;
    const scan = new Html5Qrcode('qr-reader');
    scannerRef.current = scan;
    Html5Qrcode.getCameras()
      .then((cams) => {
        if (!disposed && cams && cams.length) setCameras(cams);
      })
      .catch(() => {});
    startScanner(null);
    return () => {
      disposed = true;
      const s = scannerRef.current;
      scannerRef.current = null;
      (async () => {
        try {
          if (s && s.isScanning) await s.stop();
        } catch {
          /* noop */
        }
        try {
          if (s) await s.clear();
        } catch {
          /* noop */
        }
      })();
    };
  }, [startScanner]);

  const toggleTorch = useCallback(async () => {
    const s = scannerRef.current;
    if (!s || !s.isScanning) return;
    const next = !torchOn;
    try {
      await s.applyVideoConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch {
      showToast('Lanterna não disponível neste dispositivo.', 'error');
    }
  }, [torchOn, showToast]);

  const switchCamera = useCallback(async () => {
    if (cameras.length < 2) {
      showToast('Apenas uma câmera disponível neste aparelho.', 'error');
      return;
    }
    const idx = cameras.findIndex((c) => c.id === cameraRef.current);
    const next = cameras[(idx + 1) % cameras.length];
    await stopScanner();
    await startScanner(next.id);
  }, [cameras, startScanner, stopScanner, showToast]);

  const submitKey = useCallback(async () => {
    const url = toDanfeUrl(keyInput);
    if (!url) {
      showToast('Informe uma chave de acesso válida com 44 dígitos.', 'error');
      return;
    }
    await handleScan(url);
  }, [keyInput, handleScan, showToast]);

  const handleFile = useCallback(
    async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const s = scannerRef.current;
      try {
        const result = await s.scanFileV2(file, false);
        if (result && result.decodedText) {
          await handleScan(result.decodedText);
        } else {
          showToast('Nenhum QR Code detectado no arquivo.', 'error');
        }
      } catch {
        showToast('Não foi possível ler o arquivo enviado.', 'error');
      }
      e.target.value = '';
    },
    [handleScan, showToast]
  );

  return (
    <div className="min-h-dvh bg-surface pb-24 pt-safe">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
        <div className="h-16 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <Store className="w-[22px] h-[22px]" />
            </div>
            <h1 className="text-headline-sm font-semibold tracking-tight">Bipar Nota</h1>
          </div>
          <button
            type="button"
            aria-label="Sincronizar"
            onClick={onSync}
            className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <RefreshCw className={`w-[22px] h-[22px] ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full px-gutter pt-[88px] pb-4">
        <div className="flex flex-col w-full gap-space-md">
          <section className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-label-sm text-primary uppercase tracking-wider">
                Scanner Ativo • V3.2
              </span>
            </div>
            <h2 className="text-headline-sm">Escanear QR Code da NFC-e</h2>
            <p className="text-body-sm text-on-surface-variant">
              Aponte a câmera para o QR Code da nota fiscal para atualizar os preços no comparador
              instantaneamente.
            </p>
          </section>

          <section className="relative w-full aspect-[4/5] max-h-[440px] rounded-2xl overflow-hidden bg-inverse-surface shadow-xl select-none">
            <div id="qr-reader" className="absolute left-0 right-0 top-0 bottom-0" />

            <div className="absolute inset-0 bg-gradient-to-b from-inverse-surface/60 via-transparent to-inverse-surface/80 z-[1] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between p-space-md">
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-secondary-container" />
                <span className="text-label-sm">Auto-foco ativado</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  aria-label="Ligar lanterna"
                  onClick={toggleTorch}
                  className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-95 transition-all ${
                    torchOn
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-lowest/20 text-on-primary'
                  }`}
                >
                  <Flashlight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Alternar câmera"
                  onClick={switchCamera}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary flex items-center justify-center active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative w-64 h-64 max-w-[70vw] max-h-[70vw] flex items-center justify-center">
                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-secondary-container to-transparent blur-[1px] animate-scanline top-2" />
                <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-xl bg-secondary-container/90 shadow-[-2px_-2px_8px_rgba(108,248,187,0.6)]" />
                <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-xl bg-secondary-container/90 shadow-[2px_-2px_8px_rgba(108,248,187,0.6)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-xl bg-secondary-container/90 shadow-[-2px_2px_8px_rgba(108,248,187,0.6)]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-xl bg-secondary-container/90 shadow-[2px_2px_8px_rgba(108,248,187,0.6)]" />
                <div className="w-full h-full rounded-2xl bg-primary-container/5 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-space-sm">
                  <QrCode className="w-9 h-9 text-secondary-container animate-pulse" />
                  <p className="text-label-sm text-inverse-on-surface mt-space-xs font-medium">
                    Posicione o código quadrado aqui
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center z-10">
              <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-inverse-surface/80 backdrop-blur-md">
                <BadgeCheck className="w-[18px] h-[18px] text-secondary-fixed" />
                <span className="text-label-sm text-inverse-on-surface">
                  Leitura inteligente de Danfe NFC-e
                </span>
              </div>
            </div>

            {initializing && !camError && (
              <div className="absolute inset-0 z-20 bg-inverse-surface/70 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-inverse-on-surface">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary-container" />
                  <p className="text-label-md">Abrindo câmera...</p>
                </div>
              </div>
            )}

            {camError && (
              <div className="absolute inset-0 z-20 bg-inverse-surface/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
                <Link2 className="w-9 h-9 text-secondary-fixed" />
                <p className="text-body-md text-inverse-on-surface font-medium">
                  Câmera indisponível ou sem permissão.
                </p>
                <button
                  type="button"
                  onClick={() => setShowManual(true)}
                  className="px-4 py-2 rounded-full bg-on-primary text-primary text-label-md font-semibold shadow-sm active:scale-95 transition-all"
                >
                  Informar chave manualmente
                </button>
              </div>
            )}

            {processing && (
              <div className="absolute inset-0 z-20 bg-inverse-surface/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-inverse-on-surface">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary-container" />
                  <p className="text-label-md">Enviando nota para a fila...</p>
                </div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-2 gap-space-sm">
            <button
              type="button"
              onClick={() => setShowManual((v) => !v)}
              className="flex items-center gap-space-sm p-space-md rounded-2xl bg-surface-container-low active:bg-surface-container transition-all text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                <Keyboard className="w-[22px] h-[22px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-md text-on-surface truncate">Chave de Acesso</span>
                <span className="text-body-sm text-on-surface-variant truncate">44 dígitos</span>
              </div>
            </button>
            <label className="flex items-center gap-space-sm p-space-md rounded-2xl bg-surface-container-low active:bg-surface-container transition-all text-left shadow-sm cursor-pointer">
              <input
                accept="image/*,application/pdf"
                className="hidden"
                id="file-upload-input"
                type="file"
                onChange={handleFile}
              />
              <div className="w-10 h-10 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary shrink-0">
                <Upload className="w-[22px] h-[22px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-md text-on-surface truncate">Importar Nota</span>
                <span className="text-body-sm text-on-surface-variant truncate">Foto ou imagem</span>
              </div>
            </label>
          </section>

          {showManual && (
            <section className="flex flex-col gap-space-sm p-space-md rounded-2xl bg-surface-container-lowest shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <Keyboard className="text-primary w-5 h-5" />
                  <span className="text-label-md text-on-surface">Digitação da Chave NFC-e</span>
                </div>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setShowManual(false)}
                  className="text-on-surface-variant p-1 rounded-full hover:bg-surface-container transition-colors"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.replace(/\D/g, ''))}
                  maxLength={44}
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-body-md text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                  placeholder="Ex: 3524 0100 0000 0000 0000..."
                  type="text"
                  inputMode="numeric"
                />
              </div>
              <div className="flex justify-between items-center text-on-surface-variant text-body-sm px-1">
                <span>{keyInput.length}/44 dígitos</span>
                <button
                  type="button"
                  onClick={submitKey}
                  disabled={keyInput.length !== 44}
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary text-label-md active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  Consultar
                </button>
              </div>
            </section>
          )}

          {lastResult && (
            <section className="flex flex-col gap-space-xs">
              <span className="text-label-sm text-on-surface-variant uppercase tracking-wider px-1">
                Último QR Code identificado
              </span>
              <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-card flex flex-col gap-space-md">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary-container" />
                      <span className="text-label-sm text-primary uppercase">
                        Enviado para processamento
                      </span>
                    </div>
                    <h3 className="text-label-lg text-on-surface font-semibold truncate">
                      {shrink(lastResult.url, 48)}
                    </h3>
                    <span className="text-body-sm text-on-surface-variant">
                      Hoje às {lastResult.at}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}