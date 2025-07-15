import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';

import { FoodCard } from 'components/containers';

import useMenu from './useMenu';

const Menu: React.FC = () => {
  const { menuItems, isLoading, error, refetch } = useMenu();

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
          <Alert.Heading>Erro ao carregar menu</Alert.Heading>
          <p>Não foi possível carregar o menu. Tente novamente.</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={refetch} variant='outline-danger'>
              Tentar novamente
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className='card-fade-in'>
        <Alert variant='info'>
          <Alert.Heading>Menu vazio</Alert.Heading>
          <p>Nenhum alimento disponível no menu no momento.</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={refetch} variant='outline-info'>
              Atualizar menu
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className='d-flex flex-column overflow-auto gap-3 card-fade-in'>
      {menuItems.map((item) => (
        <FoodCard
          key={item.id}
          title={item.name}
          imageUrl={item.photo}
          proteinValue={item.protein}
          carbValue={item.carbs}
          fatValue={item.fat}
        />
      ))}
    </div>
  );
};

export default Menu;
