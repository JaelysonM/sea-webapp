import React from 'react';
import { Alert, Button, Modal, ProgressBar } from 'react-bootstrap';

interface ResetProgress {
  total: number;
  completed: number;
  current?: string;
  errors: Array<{ foodId: number; foodName: string; error: string }>;
}

interface ResetMenuModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  isResetting: boolean;
  progress?: ResetProgress | null;
  error?: string | null;
}

const ResetMenuModal: React.FC<ResetMenuModalProps> = ({
  show,
  onHide,
  onConfirm,
  isResetting,
  progress,
  error,
}) => {
  const progressPercentage = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
  const isComplete = progress && progress.completed === progress.total;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton={!isResetting}>
        <Modal.Title>
          <i className='bi bi-arrow-clockwise me-2'></i>
          Reiniciar Menu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isResetting && !progress && !error && (
          <div>
            <div className='d-flex align-items-start mb-3'>
              <i className='bi bi-exclamation-triangle text-warning fs-2 me-3'></i>
              <div>
                <h6 className='mb-2'>Tem certeza que deseja reiniciar o menu?</h6>
                <p className='mb-2'>
                  Esta ação irá <strong>desanexar todas as balanças ativas</strong> do sistema.
                </p>
                <div className='alert alert-info mb-0'>
                  <i className='bi bi-info-circle me-2'></i>
                  <strong>O que acontece:</strong>
                  <ul className='mb-0 mt-2'>
                    <li>Todos os alimentos ativos terão suas balanças desanexadas</li>
                    <li>Os alimentos ficarão inativos até serem anexados novamente</li>
                    <li>As refeições em andamento não serão afetadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant='danger'>
            <i className='bi bi-exclamation-triangle me-2'></i>
            {error}
          </Alert>
        )}

        {isResetting && progress && (
          <div>
            <div className='mb-3'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <span className='fw-semibold'>Progresso do Reset</span>
                <span className='text-muted'>
                  {progress.completed} de {progress.total} alimentos
                </span>
              </div>
              <ProgressBar now={progressPercentage} className='mb-2' />
              <div className='text-center'>
                <small className='text-muted'>{progressPercentage}% concluído</small>
              </div>
            </div>

            {progress.current && (
              <div className='text-center mb-3'>
                <div className='spinner-border spinner-border-sm me-2' role='status'></div>
                <span>Resetando: {progress.current}...</span>
              </div>
            )}

            {progress.errors.length > 0 && (
              <Alert variant='warning'>
                <Alert.Heading>Erros encontrados:</Alert.Heading>
                <ul className='mb-0'>
                  {progress.errors.map((error, index) => (
                    <li key={index}>
                      <strong>{error.foodName}</strong> (ID: {error.foodId}): {error.error}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        )}

        {isComplete && (
          <Alert variant={progress!.errors.length > 0 ? 'warning' : 'success'}>
            <i
              className={`bi ${
                progress!.errors.length > 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'
              } me-2`}
            ></i>
            <strong>Reset concluído!</strong>
            <br />
            {progress!.errors.length === 0 ? (
              <span>Todos os {progress!.total} alimentos foram desanexados com sucesso.</span>
            ) : (
              <span>
                {progress!.completed - progress!.errors.length} de {progress!.total} alimentos foram
                desanexados com sucesso.
              </span>
            )}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onHide} disabled={isResetting && !isComplete}>
          {isComplete ? 'Fechar' : 'Cancelar'}
        </Button>
        {!isResetting && !progress && (
          <Button variant='warning' onClick={onConfirm}>
            <i className='bi bi-arrow-clockwise me-2'></i>
            Confirmar Reset
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ResetMenuModal;
