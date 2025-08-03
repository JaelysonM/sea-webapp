import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';

import { useNFC } from 'components/hooks';

import useGenerateQR from './useGenerateQR';

interface NFCReadingResult {
  content: string;
  qrCodeUrl: string;
}

const Plates: React.FC = () => {
  const {
    isReading,
    data: nfcData,
    error: nfcError,
    canUseNFC,
    unsupportedReason,
    startReading,
    stopReading,
    clear: clearNFC,
  } = useNFC();

  const { generateQR, isLoading: isGeneratingQR, error: qrError } = useGenerateQR();

  const [result, setResult] = useState<NFCReadingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQR = useCallback(
    async (plateId: string) => {
      const qrResult = await generateQR({ plateId });
      if (qrResult) {
        setResult(qrResult);
      }
    },
    [generateQR],
  );

  useEffect(() => {
    if (nfcData && !result && !isGeneratingQR) {
      handleGenerateQR(nfcData);
    }
  }, [nfcData, result, isGeneratingQR, handleGenerateQR]);

  const handleStartNFC = async () => {
    setError(null);
    setResult(null);
    clearNFC();
    await startReading();
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result.qrCodeUrl;
    link.download = `qrcode-plate-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!result) return;

    try {
      const response = await fetch(result.qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode-plate.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'QR Code do Prato',
          text: `QR Code gerado para: ${result.content}`,
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText(result.qrCodeUrl);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  const resetState = () => {
    setResult(null);
    setError(null);
    clearNFC();
    stopReading();
  };

  const combinedError = nfcError || qrError || error;

  if (isReading || isGeneratingQR) {
    return (
      <div
        className='card-fade-in d-flex justify-content-center align-items-center'
        style={{ minHeight: '300px' }}
      >
        <div className='text-center'>
          <Spinner animation='border' className='mb-3' />
          <h6 className='text-primary mb-2'>
            {isReading ? 'Aguardando tag NFC...' : 'Gerando QR Code...'}
          </h6>
          <small className='text-muted'>
            {isReading ? 'Mantenha o dispositivo próximo à tag NFC' : 'Por favor, aguarde...'}
          </small>
        </div>
      </div>
    );
  }

  if (combinedError && !result) {
    return (
      <div className='card-fade-in'>
        <Alert variant='danger'>
          <Alert.Heading>Erro ao processar NFC</Alert.Heading>
          <p>{combinedError}</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={resetState} variant='outline-danger'>
              Tentar novamente
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (result) {
    return (
      <div className='card-fade-in'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <h5 className='fw-bold mb-1'>QR Code Gerado</h5>
            <small className='text-muted'>Prato: {result.content}</small>
          </div>
          <Button variant='outline-primary' onClick={resetState} size='sm'>
            <i className='bi bi-plus-circle me-1'></i>
            Novo
          </Button>
        </div>

        <Card className='mb-3 shadow-sm' style={{ borderRadius: '0.60rem' }}>
          <Card.Body className='text-center p-3 p-md-4'>
            <div className='mb-3'>
              <i className='bi bi-check-circle-fill text-success display-6 mb-2'></i>
              <h6 className='text-success mb-2 fw-bold'>QR Code Gerado!</h6>
            </div>

            <div className='bg-light p-2 p-md-3 rounded mb-3'>
              <div className='d-flex align-items-center justify-content-center mb-1'>
                <i className='bi bi-tag-fill text-primary me-2'></i>
                <small className='text-muted'>ID do Prato</small>
              </div>
              <div className='fw-bold text-dark small'>{result.content}</div>
            </div>

            <div className='mb-3'>
              <img
                src={result.qrCodeUrl}
                alt='QR Code gerado'
                className='img-fluid border rounded shadow-sm'
                style={{ maxWidth: '200px', width: '100%' }}
              />
            </div>

            <div className='d-grid gap-2'>
              <Button variant='success' onClick={handleDownload} className='py-2' size='sm'>
                <i className='bi bi-download me-2'></i>
                Baixar QR Code
              </Button>
              <Button variant='outline-primary' onClick={handleShare} className='py-2' size='sm'>
                <i className='bi bi-share me-2'></i>
                Compartilhar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className='card-fade-in'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h5 className='fw-bold mb-1'>Gerar QR Code dos Pratos</h5>
          <small className='text-muted'>Use NFC para gerar códigos QR</small>
        </div>
      </div>

      {!canUseNFC && (
        <Alert variant='warning' className='mb-3'>
          <Alert.Heading>NFC não suportado</Alert.Heading>
          <p>{unsupportedReason}</p>
        </Alert>
      )}

      {combinedError && (
        <Alert variant='danger' className='mb-3'>
          <Alert.Heading>Erro</Alert.Heading>
          <p>{combinedError}</p>
        </Alert>
      )}

      <Card className='mb-3 shadow-sm' style={{ borderRadius: '0.60rem' }}>
        <Card.Body className='text-center p-3 p-md-4'>
          <div className='mb-3'>
            <i className='bi bi-nfc text-primary display-6 mb-2'></i>
            <h6 className='mb-2 fw-bold'>Leitura NFC</h6>
            <p className='text-muted mb-0 small'>
              Aproxime uma tag NFC do seu dispositivo para gerar o QR Code automaticamente
            </p>
          </div>

          <Container fluid className='p-0 mb-3'>
            <div className='row g-2'>
              <div className='col-4'>
                <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                  <i className='bi bi-1-circle-fill text-primary mb-1'></i>
                  <small className='text-muted' style={{ fontSize: '0.75rem' }}>
                    Aproxime a tag
                  </small>
                </div>
              </div>
              <div className='col-4'>
                <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                  <i className='bi bi-2-circle-fill text-primary mb-1'></i>
                  <small className='text-muted' style={{ fontSize: '0.75rem' }}>
                    Aguarde leitura
                  </small>
                </div>
              </div>
              <div className='col-4'>
                <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                  <i className='bi bi-3-circle-fill text-primary mb-1'></i>
                  <small className='text-muted' style={{ fontSize: '0.75rem' }}>
                    QR gerado
                  </small>
                </div>
              </div>
            </div>
          </Container>

          <Button
            variant='primary'
            size='lg'
            onClick={handleStartNFC}
            disabled={!canUseNFC}
            className='w-100 py-3'
          >
            <i className='bi bi-nfc me-2'></i>
            Iniciar Leitura NFC
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Plates;
