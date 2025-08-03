import React from 'react';
import { Container } from 'react-bootstrap';

import { QRCodeScanner } from 'components/containers';
import { useNFCWithAutoRestart } from 'components/hooks';

import styles from './PlateScanner.module.scss';

interface PlateScannerProps {
  onScan: (result: string, type: 'qr' | 'nfc') => void;
  onError?: (error: Error) => void;
}

const PlateScanner: React.FC<PlateScannerProps> = ({ onScan, onError }) => {
  const { isReading: nfcIsReading, canUseNFC } = useNFCWithAutoRestart({
    onScan: (data) => onScan(data, 'nfc'),
    onError: onError,
  });

  const handleQRScan = (result: string) => {
    onScan(result, 'qr');
  };

  return (
    <Container className='p-0 d-flex flex-column gap-3'>
      {canUseNFC && nfcIsReading ? (
        <>
          <div
            className={`${styles.nfcIndicator} d-flex align-items-center px-2 py-1 card-fade-in`}
          >
            <div className={`${styles.nfcIcon} me-2`}>
              <i
                className={`bi ${nfcIsReading ? 'bi-broadcast' : 'bi-broadcast-pin'}`}
                style={{
                  fontSize: '0.9rem',
                  color: nfcIsReading ? 'var(--bs-success)' : 'var(--bs-secondary)',
                }}
              />
            </div>
            <div className='flex-grow-1'>
              <span className='small text-muted'>Aproxime o prato, se preferir</span>
            </div>
          </div>
        </>
      ) : null}
      <QRCodeScanner onScan={handleQRScan} onError={onError} />
    </Container>
  );
};

export default PlateScanner;
