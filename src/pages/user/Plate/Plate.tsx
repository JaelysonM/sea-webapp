import React from 'react';
import { Container } from 'react-bootstrap';
import plateImage from 'assets/images/plate.png';

import {
  CalorieDisplayCard,
  DisplayBalance,
  NutrientStatCard,
  PieChartWithOverlay,
} from 'components/containers';
import { PieChartSliceData } from 'components/elements';
import { useWindowSize } from 'components/hooks';

const exampleChartSlices: PieChartSliceData[] = [
  {
    id: 1,
    percentage: 60,
    color: 'var(--bs-primary)',
    label: 'Arroz',
    details: '500g',
  },
  {
    id: 2,
    percentage: 40,
    color: 'var(--bs-success)',
    label: 'Feijão',
  },
];

const Plate: React.FC = () => {
  const { width } = useWindowSize();
  return (
    <Container className='p-0 gap-3 d-flex flex-column align-items-center card-fade-in'>
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <DisplayBalance
          price={50}
          weight={0.568}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 10,
          }}
        />
        <PieChartWithOverlay
          imageSrc={plateImage}
          imageAlt='Prato com análise nutricional sobreposta'
          chartSlices={exampleChartSlices}
          chartSize={Math.min(width * 0.5, 300)}
          onSliceDetailClick={(slice) => {
            console.log(`Detalhes do slice: ${slice.label} - ${slice.percentage}%`);
          }}
        />
      </div>

      <CalorieDisplayCard title='Calorias do seu prato' calories={2500} />
      <Container
        className='d-flex p-0 justify-content-between'
        style={{ maxWidth: 450, width: '100%' }}
      >
        <NutrientStatCard
          label='Proteínas'
          unit='g'
          iconClassName='bi bi-egg'
          color='var(--bs-danger)'
          data={{
            percentage: 30,
            calories: 200,
            weight: 150,
          }}
        />
        <NutrientStatCard
          label='Carboidratos'
          unit='g'
          iconClassName='bi bi-lightning-charge-fill'
          color='var(--bs-primary)'
          data={{
            percentage: 50,
            calories: 400,
            weight: 200,
          }}
        />
        <NutrientStatCard
          label='Gorduras'
          unit='g'
          iconClassName='bi bi-droplet-half'
          color='var(--bs-warning)'
          data={{
            percentage: 20,
            calories: 400,
            weight: 100,
          }}
        />
      </Container>
    </Container>
  );
};

export default Plate;
