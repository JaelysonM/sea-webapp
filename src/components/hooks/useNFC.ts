import { useCallback, useState } from 'react';
import { NDEFReader, NDEFReadingEvent } from '@types';

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

/**
 * Hook para leitura de tags NFC
 * @returns Objeto com estado e métodos para controle da leitura NFC
 */
const useNFC = (): UseNFCReturn => {
  const [isReading, setIsReading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ndefReader, setNdefReader] = useState<NDEFReader | null>(null);

  const isSupported = 'NDEFReader' in window;

  const getUnsupportedReason = (): string | null => {
    if (!('NDEFReader' in window)) {
      return 'Web NFC API não está disponível neste navegador';
    }

    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      return 'NFC requer HTTPS ou localhost';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
    const isEdge = userAgent.includes('edg');

    if (!isAndroid) {
      return 'NFC só funciona em dispositivos Android';
    }

    if (!isChrome && !isEdge) {
      return 'NFC só funciona no Chrome ou Edge';
    }

    return null;
  };

  const unsupportedReason = getUnsupportedReason();
  const canUseNFC = isSupported && !unsupportedReason;

  /**
   * Inicia a leitura de tags NFC
   */
  const startReading = useCallback(async (): Promise<void> => {
    if (!canUseNFC) {
      setError(unsupportedReason || 'NFC não disponível');
      return;
    }

    try {
      setIsReading(true);
      setError(null);
      setData(null);

      const reader = new window.NDEFReader!();
      setNdefReader(reader);

      await reader.scan();

      reader.onreading = (event: NDEFReadingEvent) => {
        if (event.serialNumber) {
          setData(event.serialNumber.toUpperCase());
          return;
        }
        setError('Tag detectada sem número de série');
      };

      reader.onreadingerror = () => {
        setError('Erro ao ler tag NFC');
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao iniciar leitura: ${errorMessage}`);
      setIsReading(false);
    }
  }, [canUseNFC, unsupportedReason]);

  /**
   * Para a leitura de tags NFC
   */
  const stopReading = useCallback(async (): Promise<void> => {
    if (ndefReader) {
      try {
        await ndefReader.stop();
      } catch (err) {
        // Erro silencioso ao parar NFC
      }
    }
    setIsReading(false);
    setNdefReader(null);
  }, [ndefReader]);

  /**
   * Limpa os dados e erros armazenados
   */
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
