import React from 'react';

import { FoodCard } from 'components/containers';

const menuItems = [
  {
    id: 1,
    title: 'Feijão',
    imageUrl:
      'https://marmitexdesucesso.com.br/wp-content/uploads/2021/07/Como-conservar-feijao-cozido-fora-da-geladeira.jpg',
    proteinValue: 221,
    carbValue: 642,
    fatValue: 15,
  },
  {
    id: 2,
    title: 'Arroz',
    imageUrl: 'https://sabores-new.s3.amazonaws.com/public/2024/11/arroz_branco_de_micro_ondas.jpg',
    proteinValue: 72,
    carbValue: 795,
    fatValue: 8,
  },
  {
    id: 3,
    title: 'Frango Grelhado',
    imageUrl: 'https://img.cybercook.com.br/imagens/receitas/340/file-de-frango-grelhado-2.jpeg',
    proteinValue: 310,
    carbValue: 0,
    fatValue: 36,
  },
];

const Menu: React.FC = () => {
  return (
    <div className='d-flex flex-column overflow-auto gap-3 card-fade-in'>
      {menuItems.map((item) => (
        <FoodCard
          key={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          proteinValue={item.proteinValue}
          carbValue={item.carbValue}
          fatValue={item.fatValue}
        />
      ))}
    </div>
  );
};

export default Menu;
