import React, { useCallback, useRef, useState } from 'react';
import { Alert, Button, Card, Image, Spinner } from 'react-bootstrap';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string | File | null;
  className?: string;
  disabled?: boolean;
  error?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  className = '',
  disabled = false,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreview(null);
        onImageSelect(null);
        return;
      }

      if (!file.type.startsWith('image/')) {
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    },
    [onImageSelect],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageSource = () => {
    if (preview) return preview;
    if (typeof currentImage === 'string') return currentImage;
    return null;
  };

  const hasImage = getImageSource() || currentImage instanceof File;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Card
        className={`border-2 ${dragOver ? 'border-primary' : 'border-dashed'} ${
          disabled ? 'opacity-50' : 'cursor-pointer'
        } ${error ? 'border-danger' : ''}`}
        style={{
          minHeight: '200px',
          borderStyle: 'dashed',
          transition: 'all 0.2s ease',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Card.Body className='d-flex flex-column justify-content-center align-items-center p-4'>
          {isLoading ? (
            <Spinner animation='border' />
          ) : hasImage ? (
            <>
              <div className='position-relative'>
                <Image
                  src={getImageSource() || ''}
                  alt='Preview'
                  fluid
                  rounded
                  style={{ maxHeight: '150px', maxWidth: '100%' }}
                />
                <Button
                  variant='danger'
                  size='sm'
                  className='position-absolute top-0 end-0 translate-middle rounded-circle'
                  style={{ width: '30px', height: '30px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={disabled}
                >
                  <i className='bi bi-x' style={{ fontSize: '14px' }}></i>
                </Button>
              </div>
              <p className='text-muted mt-2 mb-0 text-center'>
                Clique para alterar a imagem ou arraste uma nova
              </p>
            </>
          ) : (
            <>
              <i className='bi bi-cloud-upload fs-1 text-secondary mb-3'></i>
              <h6 className='text-center mb-2'>Adicionar foto do alimento</h6>
              <p className='text-muted text-center mb-0'>
                Clique para selecionar ou arraste uma imagem aqui
              </p>
              <small className='text-muted mt-1'>Formatos aceitos: JPG, PNG, GIF</small>
            </>
          )}
        </Card.Body>
      </Card>

      {error && (
        <Alert variant='danger' className='mt-2 mb-0'>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default ImageUpload;
