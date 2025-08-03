import React, { useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import plateImage from 'assets/images/plate.png';

import {
  CalorieDisplayCard,
  DisplayBalance,
  NutrientStatCard,
  PieChartWithOverlay,
  PlateScanner,
} from 'components/containers';
import { PieChartSliceData } from 'components/elements/PieChart/PieChart';
import { useAnimatedCounter, useWindowSize } from 'components/hooks';

import MacroDetailsModal from './MacroDetailsModal';
import ProcessingLoader from './ProcessingLoader';
import useCurrentMeal from './useCurrentMeal';
import useInitializeMeal from './useInitializeMeal';

import styles from './Plate.module.scss';

const Plate: React.FC = () => {
  const { width } = useWindowSize();
  const { processedMeal, isLoading, error, refetch } = useCurrentMeal();
  const { initializeMeal } = useInitializeMeal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<PieChartSliceData | null>(null);

  const handleQRScan = async (result: string) => {
    setIsProcessing(true);

    try {
      const response = await initializeMeal({ plate_identifier: result });

      if (response) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await refetch();
      }
    } catch (err) {
      console.error('Erro ao inicializar refeição:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const animatedPrice = useAnimatedCounter(processedMeal.finalPrice, 800);
  const animatedWeight = useAnimatedCounter(processedMeal.totalWeight, 800);
  const animatedCalories = useAnimatedCounter(processedMeal.totalCalories, 800);
  const animatedProtein = useAnimatedCounter(processedMeal.totalProtein, 800);
  const animatedCarbs = useAnimatedCounter(processedMeal.totalCarbs, 800);
  const animatedFat = useAnimatedCounter(processedMeal.totalFat, 800);

  const totalMacros =
    processedMeal.totalProtein + processedMeal.totalCarbs + processedMeal.totalFat;
  const proteinPercentage =
    totalMacros > 0 ? Math.round((processedMeal.totalProtein / totalMacros) * 100) : 0;
  const carbsPercentage =
    totalMacros > 0 ? Math.round((processedMeal.totalCarbs / totalMacros) * 100) : 0;
  const fatPercentage =
    totalMacros > 0 ? Math.round((processedMeal.totalFat / totalMacros) * 100) : 0;

  if (isLoading) {
    return (
      <Container
        className='p-0 gap-3 d-flex flex-column align-items-center'
        style={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}
      >
        <div
          className='d-flex justify-content-center align-items-center card-fade-in'
          style={{ minHeight: '300px' }}
        >
          <Spinner animation='border' />
        </div>
      </Container>
    );
  }

  if (isProcessing) {
    return <ProcessingLoader />;
  }

  if (error) {
    return (
      <div style={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}>
        <PlateScanner onScan={handleQRScan} />
      </div>
    );
  }

  return (
    <Container
      className={`p-0 gap-3 d-flex flex-column align-items-center card-fade-in ${styles.plateContainer}`}
      style={{
        opacity: 1,
        transition: 'opacity 0.3s ease-in-out',
        paddingBottom: '2rem',
      }}
    >
      <div
        className={styles.plateWrapper}
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <DisplayBalance
          price={animatedPrice}
          weight={animatedWeight / 1000}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 10,
          }}
        />
        <PieChartWithOverlay
          imageSrc={plateImage}
          imageAlt='Prato com análise nutricional sobreposta'
          chartSlices={processedMeal.chartSlices}
          chartSize={Math.min(width * 0.5, 300)}
          onSliceDetailClick={(slice) => {
            setSelectedSlice(slice);
            setShowMacroModal(true);
          }}
        />
      </div>

      <CalorieDisplayCard
        title='Calorias do seu prato'
        calories={Math.round(animatedCalories)}
        className={styles.calorieCard}
      />
      <Container
        className={`d-flex p-0 justify-content-between ${styles.nutrientCards}`}
        style={{ maxWidth: 450, width: '100%' }}
      >
        <NutrientStatCard
          label='Proteínas'
          unit='g'
          iconClassName='bi bi-egg'
          color='var(--bs-danger)'
          data={{
            percentage: proteinPercentage,
            calories: Math.round(animatedProtein * 4),
            weight: Math.round(animatedProtein),
          }}
        />
        <NutrientStatCard
          label='Carboidratos'
          unit='g'
          iconClassName='bi bi-lightning-charge-fill'
          color='var(--bs-primary)'
          data={{
            percentage: carbsPercentage,
            calories: Math.round(animatedCarbs * 4),
            weight: Math.round(animatedCarbs),
          }}
        />
        <NutrientStatCard
          label='Gorduras'
          unit='g'
          iconClassName='bi bi-droplet-half'
          color='var(--bs-warning)'
          data={{
            percentage: fatPercentage,
            calories: Math.round(animatedFat * 9),
            weight: Math.round(animatedFat),
          }}
        />
      </Container>

      <MacroDetailsModal
        show={showMacroModal}
        onHide={() => setShowMacroModal(false)}
        slice={selectedSlice}
        totalMacros={{
          protein: processedMeal.totalProtein,
          carbs: processedMeal.totalCarbs,
          fat: processedMeal.totalFat,
        }}
      />
    </Container>
  );
};

export default Plate;
