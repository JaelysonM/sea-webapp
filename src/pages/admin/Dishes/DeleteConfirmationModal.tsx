import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  foodName: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  foodName,
  isLoading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex align-items-start mb-3'>
          <i className='bi bi-exclamation-triangle-fill text-warning fs-2 me-3'></i>
          <div>
            <h6 className='mb-2'>Tem certeza que deseja deletar este alimento?</h6>
            <p className='mb-2'>
              <strong>Alimento:</strong> {foodName}
            </p>
            <p className='text-muted mb-0'>
              Esta ação não pode ser desfeita. O alimento será permanentemente removido do sistema.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant='danger' onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className='spinner-border spinner-border-sm me-2' role='status' />
              Deletando...
            </>
          ) : (
            <>
              <i className='bi bi-trash me-2'></i>
              Deletar Alimento
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
