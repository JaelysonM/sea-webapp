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
  const imageStatus = useImageLoader(imageUrl);

  return (
    <Card className={`border rounded ${className}`}>
      <Card.Body className='p-0'>
        <Row className='g-0'>
          <Col
            xs={5}
            className='d-flex justify-content-center align-items-center bg-light-subtle'
            style={{ minHeight: '150px' }}
          >
            {imageStatus === 'loading' && <Spinner animation='border' variant='secondary' />}
            {imageStatus === 'error' && <i className='bi bi-image-alt fs-1 text-secondary'></i>}
            {imageStatus === 'loaded' && (
              <Image
                src={imageUrl}
                fluid
                rounded
                className='w-100'
                style={{ objectFit: 'cover', height: '100%', pointerEvents: 'none' }}
              />
            )}
          </Col>
          <Col xs={7} className='d-flex flex-column justify-content-center p-3 m-0'>
            <div className='d-flex align-items-center mb-3'>
              <h2 className='fw-bold m-0' style={{ fontSize: '2rem' }}>
                {title}
              </h2>
              {tag && (
                <Badge bg={tag.variant} className='ms-3 fs-6 lh-1'>
                  {tag.text}
                </Badge>
              )}
            </div>
            <div className='d-flex flex-column'>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: '1.5rem' }}>
                  <i className='bi bi-egg' style={{ color: 'var(--bs-danger)' }}></i>
                </div>
                <span className='fw-bold ps-2' style={{ fontSize: '1rem', minWidth: '80px' }}>
                  {proteinValue}g/100g
                </span>
                <span className='text-secondary' style={{ fontSize: '1rem' }}>
                  Proteínas
                </span>
              </div>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: '1.5rem' }}>
                  <i
                    className='bi bi-lightning-charge-fill'
                    style={{ color: 'var(--bs-primary)' }}
                  ></i>
                </div>
                <span className='fw-bold ps-2' style={{ fontSize: '1rem', minWidth: '80px' }}>
                  {carbValue}g/100g
                </span>
                <span className='text-secondary' style={{ fontSize: '1rem' }}>
                  Carboidratos
                </span>
              </div>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: '1.5rem' }}>
                  <i className='bi bi-droplet-half' style={{ color: 'var(--bs-warning)' }}></i>
                </div>
                <span className='fw-bold ps-2' style={{ fontSize: '1rem', minWidth: '80px' }}>
                  {fatValue}g/100g
                </span>
                <span className='text-secondary' style={{ fontSize: '1rem' }}>
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
