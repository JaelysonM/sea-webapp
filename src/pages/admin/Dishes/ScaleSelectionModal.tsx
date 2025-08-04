import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Scale } from '@types';

interface ScaleSelectionModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (scaleId: number) => void;
  foodName: string;
  scales: Scale[];
  isLoading?: boolean;
  error?: string | null;
  fetchScales: () => void;
  scalesLoading: boolean;
}

const ScaleSelectionModal: React.FC<ScaleSelectionModalProps> = ({
  show,
  onHide,
  onConfirm,
  foodName,
  scales,
  isLoading = false,
  error,
  fetchScales,
  scalesLoading,
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<number | null>(null);

  useEffect(() => {
    if (show) {
      fetchScales();
    }
  }, [show, fetchScales]);

  useEffect(() => {
    if (show) {
      setSelectedScaleId(null);
    }
  }, [show]);

  const handleConfirm = () => {
    if (selectedScaleId !== null) {
      onConfirm(selectedScaleId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Anexar Balança</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <h6 className='mb-2'>Selecionar balança para o alimento:</h6>
          <p className='mb-3'>
            <strong>{foodName}</strong>
          </p>
          <p className='text-muted mb-3'>
            Selecione uma balança disponível para ativar este alimento no sistema.
          </p>
        </div>

        {error && (
          <Alert variant='danger' className='mb-3'>
            {error}
          </Alert>
        )}

        {scalesLoading ? (
          <div className='d-flex justify-content-center align-items-center py-4'>
            <Spinner animation='border' className='me-2' />
            <span>Carregando balanças...</span>
          </div>
        ) : scales.length === 0 ? (
          <Alert variant='warning'>
            <div className='d-flex align-items-center justify-content-between'>
              <span>Nenhuma balança disponível encontrada.</span>
              <Button variant='outline-warning' size='sm' onClick={fetchScales}>
                <i className='bi bi-arrow-clockwise me-1'></i>
                Atualizar
              </Button>
            </div>
          </Alert>
        ) : (
          <Form.Group>
            <Form.Label>Balanças Disponíveis:</Form.Label>
            <div className='border rounded p-2' style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {scales.map((scale) => (
                <div key={scale.id} className='form-check py-2'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='scaleSelection'
                    id={`scale-${scale.id}`}
                    value={scale.id}
                    checked={selectedScaleId === scale.id}
                    onChange={() => setSelectedScaleId(scale.id)}
                    disabled={isLoading}
                  />
                  <label className='form-check-label w-100' htmlFor={`scale-${scale.id}`}>
                    <div className='d-flex justify-content-between align-items-center'>
                      <div>
                        <strong>{scale.name}</strong>
                        <br />
                        <small className='text-muted'>Serial: {scale.serial}</small>
                      </div>
                      <i className='bi bi-speedometer2 text-primary'></i>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant='success'
          onClick={handleConfirm}
          disabled={isLoading || selectedScaleId === null || scalesLoading}
        >
          {isLoading ? (
            <>
              <span className='spinner-border spinner-border-sm me-2' role='status' />
              Anexando...
            </>
          ) : (
            <>
              <i className='bi bi-link me-2'></i>
              Anexar Balança
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScaleSelectionModal;
