import { useCallback, useMemo, useRef, useState } from 'react';
import type { NDEFReadingEvent } from '@types';

interface UseNFCReturn {
  isReading: boolean;
  data: string | null;
  error: string | null;
  isSupported: boolean;
  canUseNFC: boolean;
  unsupportedReason: string | null;
  startReading: () => Promise<void>;
  stopReading: () => Promise<void>;
  clear: () => void;
}

const useNFC = (): UseNFCReturn => {
  const [isReading, setIsReading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const isSupported = useMemo(() => 'NDEFReader' in window, []);

  const unsupportedReason = useMemo(() => {
    if (!isSupported) {
      return 'A API Web NFC não está disponível neste navegador.';
    }
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      return 'A leitura de NFC requer um contexto seguro (HTTPS).';
    }
    return null;
  }, [isSupported]);

  const canUseNFC = isSupported && !unsupportedReason;

  const stopReading = useCallback(async (): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsReading(false);
  }, []);

  const startReading = useCallback(async (): Promise<void> => {
    if (!canUseNFC) {
      setError(unsupportedReason || 'NFC não é suportado ou está desabilitado.');
      return;
    }
    if (isReading) {
      console.warn('A leitura de NFC já está ativa.');
      return;
    }

    await stopReading();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const reader = new window.NDEFReader!();

      setData(null);
      setError(null);
      setIsReading(true);

      await reader.scan({ signal: controller.signal });

      reader.onreading = (event: NDEFReadingEvent) => {
        if (event.serialNumber) {
          const formattedSerial = event.serialNumber.toUpperCase().replace(/:/g, '-');
          setData(formattedSerial);
          stopReading();
        } else {
          setError('A tag NFC não possui um número de série.');
          stopReading();
        }
      };

      reader.onreadingerror = (event) => {
        console.error('Erro ao ler a tag NFC.', event);
        setError('Não foi possível ler a tag NFC.');
        stopReading();
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // AbortError is expected, do nothing.
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('Erro ao iniciar a varredura NFC:', err);
        setError(`Erro ao iniciar a leitura: ${errorMessage}`);
        setIsReading(false);
      }
    }
  }, [canUseNFC, isReading, unsupportedReason, stopReading]);

  const clear = useCallback((): void => {
    setData(null);
    setError(null);
  }, []);

  return {
    isReading,
    data,
    error,
    isSupported,
    canUseNFC,
    unsupportedReason,
    startReading,
    stopReading,
    clear,
  };
};

export default useNFC;
