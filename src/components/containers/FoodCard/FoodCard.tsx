import React from 'react';
import { Badge, Card, Col, Image, Row, Spinner } from 'react-bootstrap';

import { useImageLoader } from 'components/hooks';

interface Props {
  title: string;
  imageUrl: string;
  proteinValue: number;
  carbValue: number;
  fatValue: number;
  className?: string;
  tag?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  };
}

const FoodCard: React.FC<Props> = ({
  title,
  imageUrl,
  proteinValue,
  carbValue,
  fatValue,
  tag,
  className = '',
}) => {
  const { status: imageStatus, imageUrl: imageSource } = useImageLoader(imageUrl);

  return (
    <Card className={`border rounded ${className}`}>
      <Card.Body className='p-0'>
        <Row className='g-0'>
          <Col
            xs={4}
            sm={3}
            md={4}
            className='d-flex justify-content-center align-items-center bg-light-subtle'
            style={{ minHeight: '120px', borderRadius: '0.375rem 0 0 0.375rem' }}
          >
            {imageStatus === 'loading' && <Spinner animation='border' variant='secondary' />}
            {imageStatus === 'error' && (
              <i className='bi bi-image-alt fs-1 text-secondary' style={{}}></i>
            )}
            {imageStatus === 'loaded' && (
              <Image
                src={imageSource || imageUrl}
                fluid
                loading='lazy'
                className='w-100 h-100'
                style={{
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  borderRadius: '0.375rem 0 0 0.375rem',
                }}
              />
            )}
          </Col>
          <Col
            xs={8}
            sm={9}
            md={8}
            className='d-flex flex-column justify-content-center p-2 p-sm-3 m-0'
          >
            <div className='d-flex align-items-center mb-2 mb-sm-3'>
              <h2
                className='fw-bold m-0 text-truncate'
                style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}
              >
                {title}
              </h2>
              {tag && (
                <Badge
                  bg={tag.variant}
                  className='ms-2 flex-shrink-0'
                  style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }}
                >
                  {tag.text}
                </Badge>
              )}
            </div>
            <div className='d-flex flex-column gap-1'>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', width: '24px' }}>
                  <i className='bi bi-egg' style={{ color: 'var(--bs-danger)' }}></i>
                </div>
                <span
                  className='fw-bold ps-2 flex-shrink-0'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', minWidth: '80px' }}
                >
                  {proteinValue}g/100g
                </span>
                <span
                  className='text-secondary text-truncate'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}
                >
                  Proteínas
                </span>
              </div>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', width: '24px' }}>
                  <i
                    className='bi bi-lightning-charge-fill'
                    style={{ color: 'var(--bs-primary)' }}
                  ></i>
                </div>
                <span
                  className='fw-bold ps-2 flex-shrink-0'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', minWidth: '80px' }}
                >
                  {carbValue}g/100g
                </span>
                <span
                  className='text-secondary text-truncate'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}
                >
                  Carboidratos
                </span>
              </div>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', width: '24px' }}>
                  <i className='bi bi-droplet-half' style={{ color: 'var(--bs-warning)' }}></i>
                </div>
                <span
                  className='fw-bold ps-2 flex-shrink-0'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', minWidth: '80px' }}
                >
                  {fatValue}g/100g
                </span>
                <span
                  className='text-secondary text-truncate'
                  style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}
                >
                  Gorduras
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
