import React from 'react';
import { Card, Col, Image, Row, Spinner } from 'react-bootstrap';

import { useImageLoader } from 'components/hooks';

interface Props {
  title: string;
  imageUrl: string;
  proteinValue: number;
  carbValue: number;
  fatValue: number;
  className?: string;
}

const FoodCard: React.FC<Props> = ({
  title,
  imageUrl,
  proteinValue,
  carbValue,
  fatValue,

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
                className='w-100'
                style={{ objectFit: 'cover', height: '100%' }}
              />
            )}
          </Col>
          <Col xs={7} className='d-flex flex-column justify-content-center p-3 m-0'>
            <h2 className='fw-bold' style={{ fontSize: '2rem' }}>
              {title}
            </h2>
            <div className='d-flex flex-column'>
              <div className='d-flex align-items-center'>
                <div style={{ fontSize: '1.5rem' }}>
                  <i className='bi bi-egg' style={{ color: 'var(--bs-danger)' }}></i>
                </div>
                <span className='fw-bold ps-2' style={{ fontSize: '1rem', minWidth: '80px' }}>
                  {proteinValue}g/kg
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
                  {carbValue}g/kg
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
                  {fatValue}g/kg
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
