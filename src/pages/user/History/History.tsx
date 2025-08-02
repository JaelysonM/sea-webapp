import React from 'react';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';
import moment from 'moment';

import { useAnimatedCounter } from 'components/hooks';

import type { FoodMeasurement, MealHistory } from './useMealHistory';
import useMealHistory from './useMealHistory';

import styles from './History.module.scss';

interface MealCardProps {
  meal: MealHistory;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const animatedCalories = useAnimatedCounter(meal.total_calories, 300);
  const animatedPrice = useAnimatedCounter(meal.final_price, 300);
  const animatedWeight = useAnimatedCounter(meal.total_weight, 300);

  const formattedDate = moment(meal.created_at).format('DD/MM/YYYY HH:mm');
  const formattedPrice = animatedPrice.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedWeight = (animatedWeight / 1000).toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return (
    <Card className={`mb-3 shadow-sm ${styles.mealCard}`} style={{ borderRadius: '0.60rem' }}>
      <Card.Body>
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <div>
            <h5 className='mb-1 text-dark fw-bold'>Refeição #{meal.id}</h5>
            <small className='text-muted'>
              <i className='bi bi-calendar me-1'></i>
              {formattedDate}
            </small>
          </div>
          <div className='text-end'>
            <div
              className={`badge ${meal.finished ? 'bg-success' : 'bg-warning'} mb-1`}
              style={{ fontSize: '0.75rem' }}
            >
              {meal.finished ? 'Finalizada' : 'Em andamento'}
            </div>
          </div>
        </div>

        {/* Resumo nutricional */}
        <Container fluid className='p-0 mb-3'>
          <div className='row g-2'>
            <div className='col-4'>
              <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                <div className='d-flex align-items-center justify-content-center mb-1'>
                  <i className='bi bi-fire text-warning me-1'></i>
                  <small className='text-muted'>Calorias</small>
                </div>
                <div className='fw-bold text-dark'>{Math.round(animatedCalories)}</div>
                <small className='text-muted'>kcal</small>
              </div>
            </div>
            <div className='col-4'>
              <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                <div className='d-flex align-items-center justify-content-center mb-1'>
                  <i className='bi bi-speedometer2 text-primary me-1'></i>
                  <small className='text-muted'>Peso</small>
                </div>
                <div className='fw-bold text-dark'>{formattedWeight}</div>
                <small className='text-muted'>kg</small>
              </div>
            </div>
            <div className='col-4'>
              <div className='text-center p-2 bg-light rounded h-100 d-flex flex-column justify-content-center'>
                <div className='d-flex align-items-center justify-content-center mb-1'>
                  <i className='bi bi-currency-dollar text-success me-1'></i>
                  <small className='text-muted'>Preço</small>
                </div>
                <div className='fw-bold text-dark'>R$ {formattedPrice}</div>
              </div>
            </div>
          </div>
        </Container>

        {/* Macronutrientes */}
        <div className='d-flex justify-content-between mb-3'>
          <div className='text-center'>
            <i className='bi bi-egg text-danger d-block mb-1' style={{ fontSize: '1.2rem' }}></i>
            <div className='fw-semibold'>{Math.round(meal.total_protein)}g</div>
            <small className='text-muted'>Proteínas</small>
          </div>
          <div className='text-center'>
            <i
              className='bi bi-lightning-charge-fill text-primary d-block mb-1'
              style={{ fontSize: '1.2rem' }}
            ></i>
            <div className='fw-semibold'>{Math.round(meal.total_carbs)}g</div>
            <small className='text-muted'>Carboidratos</small>
          </div>
          <div className='text-center'>
            <i
              className='bi bi-droplet-half text-warning d-block mb-1'
              style={{ fontSize: '1.2rem' }}
            ></i>
            <div className='fw-semibold'>{Math.round(meal.total_fat)}g</div>
            <small className='text-muted'>Gorduras</small>
          </div>
        </div>

        {/* Lista de alimentos */}
        {meal.food_measurements.length > 0 && (
          <div>
            <h6 className='text-secondary mb-2'>Alimentos ({meal.food_measurements.length})</h6>
            <div className='d-flex flex-wrap gap-1'>
              {meal.food_measurements.slice(0, 3).map((measurement: FoodMeasurement) => (
                <span
                  key={measurement.id}
                  className='badge bg-secondary bg-opacity-10 text-dark'
                  style={{ fontSize: '0.75rem' }}
                >
                  {measurement.food.name} ({Math.round(measurement.weight)}g)
                </span>
              ))}
              {meal.food_measurements.length > 3 && (
                <span
                  className='badge bg-secondary bg-opacity-10 text-muted'
                  style={{ fontSize: '0.75rem' }}
                >
                  +{meal.food_measurements.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const History: React.FC = () => {
  const {
    meals,
    totalResults,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMealHistory();

  if (isLoading) {
    return (
      <div
        className='card-fade-in d-flex justify-content-center align-items-center'
        style={{ minHeight: '300px' }}
      >
        <Spinner animation='border' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='card-fade-in'>
        <Alert variant='danger'>
          <Alert.Heading>Erro ao carregar histórico</Alert.Heading>
          <p>Não foi possível carregar o histórico de refeições. Tente novamente.</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={() => refetch()} variant='outline-danger'>
              Tentar novamente
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className='card-fade-in'>
        <Alert variant='info'>
          <Alert.Heading>Nenhuma refeição encontrada</Alert.Heading>
          <p>Você ainda não possui histórico de refeições.</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={() => refetch()} variant='outline-info'>
              Atualizar histórico
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`card-fade-in ${styles.historyContainer}`}>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h2 className='h4 fw-bold mb-1'>Histórico de Refeições</h2>
          <small className='text-muted'>
            {totalResults} {totalResults > 1 ? 'refeições' : 'refeição'} encontrada
            {totalResults !== 1 ? 's' : ''}
          </small>
        </div>
        <Button variant='outline-primary' onClick={() => refetch()} disabled={isFetching}>
          <i className='bi bi-arrow-clockwise me-1'></i>
          Atualizar
        </Button>
      </div>

      <div className='d-flex flex-column gap-2'>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {hasNextPage && (
        <div className='d-flex justify-content-center mt-4'>
          <Button
            variant='outline-primary'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton}
          >
            {isFetchingNextPage ? (
              <>
                <Spinner as='span' animation='border' size='sm' className='me-2' />
                Carregando...
              </>
            ) : (
              'Carregar mais refeições'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;
