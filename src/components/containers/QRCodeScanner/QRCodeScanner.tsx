import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Container, Spinner, Toast } from 'react-bootstrap';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRCodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onError }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);
  const lastScanTime = useRef<number>(0);

  const checkCameraPermission = useCallback(async () => {
    try {
      // Configuração melhorada para mobile
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
    } catch (error) {
      console.error('Erro ao verificar permissão da câmera:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      // Configuração melhorada para mobile
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
    } catch (error) {
      console.error('Erro ao solicitar permissão da câmera:', error);
      setHasPermission(false);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const startScanning = useCallback(async () => {
    if (!codeReader.current || !videoRef.current || scanningRef.current) return;

    scanningRef.current = true;
    setIsScanning(true);

    try {
      await codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        const now = Date.now();

        if (result && scanningRef.current && now - lastScanTime.current > 1000) {
          lastScanTime.current = now;
          const qrContent = result.getText();
          console.log('QR Code detectado:', qrContent);
          showToastMessage(`QR Code: ${qrContent}`);
          onScan(qrContent);
        }

        // Ignorar erros comuns que não são realmente erros
        if (
          error &&
          error.name !== 'NotFoundException' &&
          error.name !== 'ChecksumException' &&
          error.name !== 'FormatException' &&
          scanningRef.current
        ) {
          console.error('Erro no scanning:', error);
          if (onError) {
            onError(error as Error);
          }
        }
      });
    } catch (error) {
      console.error('Erro ao iniciar scanning:', error);
      if (scanningRef.current && onError) {
        onError(error as Error);
      }
    }
  }, [onScan, onError, showToastMessage]);

  const stopScanning = useCallback(() => {
    scanningRef.current = false;
    setIsScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  }, []);

  const handleOpenScanner = useCallback(() => {
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
    stopScanning();
  }, [stopScanning]);

  useEffect(() => {
    checkCameraPermission();
    codeReader.current = new BrowserMultiFormatReader();

    return () => {
      scanningRef.current = false;
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [checkCameraPermission]);

  useEffect(() => {
    if (hasPermission && videoRef.current && showScanner && !isScanning) {
      startScanning();
    }
  }, [hasPermission, showScanner, isScanning, startScanning]);

  if (isLoading) {
    return (
      <Container
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '300px' }}
      >
        <Spinner animation='border' />
      </Container>
    );
  }

  if (hasPermission === false) {
    return (
      <Container className='p-0 d-flex flex-column align-items-center'>
        <div className='card shadow-lg border-0 w-100' style={{ maxWidth: '500px' }}>
          <div className='card-body p-4 text-center'>
            <div className='mb-4'>
              <div
                className='d-inline-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 mb-3'
                style={{ width: '80px', height: '80px' }}
              >
                <i
                  className='bi bi-camera-video-off text-warning'
                  style={{ fontSize: '2.5rem' }}
                ></i>
              </div>
              <h4 className='fw-bold text-dark mb-3'>Permissão de Câmera Necessária</h4>
              <p className='text-muted mb-0'>
                Para escanear QR Codes do seu prato, precisamos de acesso à sua câmera. Sua
                privacidade é protegida e apenas você tem controle sobre a câmera.
              </p>
            </div>

            <div className='d-grid gap-2'>
              <Button
                onClick={requestPermission}
                variant='warning'
                size='lg'
                className='py-3 fw-semibold'
              >
                <i className='bi bi-camera-fill me-2'></i>
                Permitir Acesso à Câmera
              </Button>

              <small className='text-muted mt-2'>
                <i className='bi bi-info-circle me-1'></i>
                <strong>Mobile:</strong> Clique em &quot;Permitir&quot; quando o navegador solicitar
                a permissão da câmera
              </small>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!showScanner) {
    return (
      <>
        <Container className='p-0 d-flex flex-column align-items-center'>
          <div className='card shadow-lg border-0 w-100' style={{ maxWidth: '500px' }}>
            <div className='card-body p-4 text-center'>
              <div className='mb-4'>
                <div
                  className='d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3'
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className='bi bi-qr-code text-primary' style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h4 className='fw-bold text-dark mb-3'>Escaneie o QR Code do Prato</h4>
                <p className='text-muted mb-0'>
                  Não encontramos nenhum prato ativo. Para carregar as informações do seu prato,
                  escaneie o QR Code que está localizado no prato físico.
                </p>
              </div>

              <div className='d-grid gap-2'>
                <Button
                  onClick={handleOpenScanner}
                  variant='primary'
                  size='lg'
                  className='py-3 fw-semibold'
                >
                  <i className='bi bi-camera-fill me-2'></i>
                  Abrir Scanner
                </Button>

                <small className='text-muted mt-2'>
                  <i className='bi bi-shield-check me-1'></i>
                  Sua privacidade é protegida - apenas você tem acesso à câmera
                </small>
              </div>
            </div>
          </div>
        </Container>

        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          className='shadow-lg'
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1050,
            minWidth: '320px',
          }}
        >
          <Toast.Header className='bg-success text-white border-0'>
            <i className='bi bi-check-circle-fill me-2'></i>
            <strong className='me-auto'>QR Code Escaneado</strong>
          </Toast.Header>
          <Toast.Body className='bg-white'>{toastMessage}</Toast.Body>
        </Toast>
      </>
    );
  }

  return (
    <>
      <Container className='p-0 d-flex flex-column align-items-center'>
        <div className='card shadow-lg border-0 w-100' style={{ maxWidth: '500px' }}>
          <div className='card-header bg-success text-white text-center py-3 border-0'>
            <h5 className='mb-0 fw-bold'>
              <i className='bi bi-camera-video me-2'></i>
              Scanner Ativo
            </h5>
          </div>

          <div className='card-body p-4'>
            <div className='text-center mb-4'>
              <h6 className='text-dark fw-semibold mb-2'>Aponte para o QR Code do Prato</h6>
              <p className='text-muted small mb-0'>
                Posicione a câmera sobre o QR Code que está no seu prato físico
              </p>
            </div>

            <div className='position-relative mx-auto' style={{ maxWidth: '350px' }}>
              <div
                className='border border-3 border-success rounded-4 overflow-hidden position-relative'
                style={{
                  aspectRatio: '1/1',
                  boxShadow: '0 8px 32px rgba(40, 167, 69, 0.2)',
                  background: 'linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
              >
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  autoPlay
                  playsInline
                  muted
                />

                {/* Overlay de scanning com animação */}
                <div
                  className='position-absolute top-50 start-50 translate-middle border border-2 border-white rounded-3'
                  style={{
                    width: '70%',
                    height: '70%',
                    borderStyle: 'dashed',
                    borderColor: 'rgba(255,255,255,0.9)',
                    pointerEvents: 'none',
                    animation: 'pulse 2s infinite',
                  }}
                />

                {/* Indicadores de canto */}
                <div
                  className='position-absolute'
                  style={{
                    top: '15%',
                    left: '15%',
                    width: '20px',
                    height: '20px',
                    borderTop: '3px solid #fff',
                    borderLeft: '3px solid #fff',
                    borderRadius: '4px 0 0 0',
                  }}
                />
                <div
                  className='position-absolute'
                  style={{
                    top: '15%',
                    right: '15%',
                    width: '20px',
                    height: '20px',
                    borderTop: '3px solid #fff',
                    borderRight: '3px solid #fff',
                    borderRadius: '0 4px 0 0',
                  }}
                />
                <div
                  className='position-absolute'
                  style={{
                    bottom: '15%',
                    left: '15%',
                    width: '20px',
                    height: '20px',
                    borderBottom: '3px solid #fff',
                    borderLeft: '3px solid #fff',
                    borderRadius: '0 0 0 4px',
                  }}
                />
                <div
                  className='position-absolute'
                  style={{
                    bottom: '15%',
                    right: '15%',
                    width: '20px',
                    height: '20px',
                    borderBottom: '3px solid #fff',
                    borderRight: '3px solid #fff',
                    borderRadius: '0 0 4px 0',
                  }}
                />
              </div>

              {/* Status indicator */}
              <div className='text-center mt-3'>
                <div className='d-inline-flex align-items-center px-3 py-1 bg-success bg-opacity-10 rounded-pill'>
                  <div
                    className='me-2 rounded-circle bg-success'
                    style={{ width: '8px', height: '8px', animation: 'pulse 1s infinite' }}
                  />
                  <small className='text-success fw-semibold'>Procurando QR Code...</small>
                </div>
              </div>
            </div>

            <div className='text-center mt-4'>
              <Button
                onClick={handleCloseScanner}
                variant='outline-secondary'
                className='px-4 py-2'
              >
                <i className='bi bi-x-lg me-2'></i>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className='shadow-lg'
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1050,
          minWidth: '320px',
        }}
      >
        <Toast.Header className='bg-success text-white border-0'>
          <i className='bi bi-check-circle-fill me-2'></i>
          <strong className='me-auto'>QR Code Escaneado!</strong>
        </Toast.Header>
        <Toast.Body className='bg-white'>{toastMessage}</Toast.Body>
      </Toast>

      {/* Adicionar CSS para animações */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default QRCodeScanner;
