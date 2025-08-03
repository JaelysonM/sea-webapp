import { useCallback, useState } from 'react';
import { useRequest } from 'apis';

interface GenerateQRData {
  plateId: string;
}

interface GenerateQRResponse {
  content: string;
  qrCodeUrl: string;
}

const useGenerateQR = () => {
  const request = useRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQR = useCallback(
    async (data: GenerateQRData): Promise<GenerateQRResponse | null> => {
      setIsLoading(true);
      setError(null);
      return new Promise((resolve) => {
        request({
          method: 'POST',
          url: `/qrcode/plate`,
          data: { plate_id: data.plateId },
          responseType: 'blob',
          onSuccess: (blob: Blob) => {
            const qrCodeUrl = URL.createObjectURL(blob);
            const result = {
              content: data.plateId,
              qrCodeUrl,
            };
            setIsLoading(false);
            resolve(result);
          },
          onError: (err) => {
            const errorMessage = err?.message || 'Erro ao gerar QR Code. Tente novamente.';
            setError(errorMessage);
            setIsLoading(false);
            resolve(null);
          },
          onComplete: () => {
            setIsLoading(false);
          },
        });
      });
    },
    [request],
  );

  return {
    generateQR,
    isLoading,
    error,
  };
};

export default useGenerateQR;
