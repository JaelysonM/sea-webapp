import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ScaleDetachModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  foodName: string;
  scaleName: string;
  isLoading?: boolean;
}

const ScaleDetachModal: React.FC<ScaleDetachModalProps> = ({
  show,
  onHide,
  onConfirm,
  foodName,
  scaleName,
  isLoading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Desanexar Balança</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex align-items-start mb-3'>
          <i className='bi bi-unlink text-warning fs-2 me-3'></i>
          <div>
            <h6 className='mb-2'>Tem certeza que deseja desanexar a balança?</h6>
            <p className='mb-2'>
              <strong>Alimento:</strong> {foodName}
            </p>
            <p className='mb-2'>
              <strong>Balança:</strong> {scaleName}
            </p>
            <div className='alert alert-warning mb-0'>
              <i className='bi bi-exclamation-triangle me-2'></i>
              <strong>Atenção:</strong> Ao desanexar a balança, este alimento ficará inativo no
              sistema e não poderá ser pesado até que uma nova balança seja anexada.
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant='warning' onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className='spinner-border spinner-border-sm me-2' role='status' />
              Desanexando...
            </>
          ) : (
            <>
              <i className='bi bi-unlink me-2'></i>
              Desanexar Balança
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScaleDetachModal;
