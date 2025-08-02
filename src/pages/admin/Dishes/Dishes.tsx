import React, { useCallback, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { BiLink, BiTrash, BiUnlink } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { ProcessedFood } from '@types';

import { FoodCard, SwipeableContainer } from 'components/containers';

import DeleteConfirmationModal from './DeleteConfirmationModal';
import ResetMenuModal from './ResetMenuModal';
import ScaleDetachModal from './ScaleDetachModal';
import ScaleSelectionModal from './ScaleSelectionModal';
import useDeleteFood from './useDeleteFood';
import useFoodsList from './useFoodsList';
import useResetMenu from './useResetMenu';
import useScales from './useScales';
import useUpdateFoodScale from './useUpdateFoodScale';

const Dishes: React.FC = () => {
  const [foodToDelete, setFoodToDelete] = useState<{ id: number; name: string } | null>(null);
  const [foodToUpdateScale, setFoodToUpdateScale] = useState<ProcessedFood | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const { processedFoods, isLoading, hasNextPage, fetchNextPage, refetch } = useFoodsList({
    page_size: 10,
  });
  const { deleteFood, isLoading: deleteLoading, error: deleteError, setError } = useDeleteFood();
  const { scales, fetchScales, isLoading: scalesLoading, error: scalesError } = useScales();
  const {
    updateFoodScale,
    isLoading: updateLoading,
    error: updateError,
    setError: setUpdateError,
  } = useUpdateFoodScale();
  const {
    resetMenu,
    isResetting,
    progress: resetProgress,
    error: resetError,
    setError: setResetError,
  } = useResetMenu();

  const handleDeleteFood = useCallback((foodId: number, foodName: string) => {
    setFoodToDelete({ id: foodId, name: foodName });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (foodToDelete) {
      const success = await deleteFood(foodToDelete.id);
      if (success) {
        setFoodToDelete(null);
        refetch();
      }
    }
  }, [deleteFood, foodToDelete, refetch]);

  const cancelDelete = useCallback(() => {
    setFoodToDelete(null);
    setError(null);
  }, [setError]);

  const handleScaleAction = useCallback((food: ProcessedFood) => {
    setFoodToUpdateScale(food);
  }, []);

  const confirmScaleAttach = useCallback(
    async (scaleId: number) => {
      if (foodToUpdateScale) {
        const success = await updateFoodScale(foodToUpdateScale.id, scaleId);
        if (success) {
          setFoodToUpdateScale(null);
          refetch();
        }
      }
    },
    [updateFoodScale, foodToUpdateScale, refetch],
  );

  const confirmScaleDetach = useCallback(async () => {
    if (foodToUpdateScale) {
      const success = await updateFoodScale(foodToUpdateScale.id, null);
      if (success) {
        setFoodToUpdateScale(null);
        refetch();
      }
    }
  }, [updateFoodScale, foodToUpdateScale, refetch]);

  const cancelScaleAction = useCallback(() => {
    setFoodToUpdateScale(null);
    setUpdateError(null);
  }, [setUpdateError]);

  const handleResetMenu = useCallback(() => {
    setShowResetModal(true);
  }, []);

  const confirmResetMenu = useCallback(async () => {
    await resetMenu(processedFoods);
  }, [resetMenu, processedFoods]);

  const handleCloseResetModal = useCallback(() => {
    if (!isResetting) {
      setShowResetModal(false);
      setResetError(null);
      // Recarregar dados após reset completo
      if (resetProgress?.completed === resetProgress?.total) {
        refetch();
      }
    }
  }, [isResetting, setResetError, resetProgress, refetch]);

  if (isLoading && processedFoods.length === 0) {
    return (
      <div
        className='card-fade-in d-flex justify-content-center align-items-center'
        style={{ minHeight: '300px' }}
      >
        <Spinner animation='border' />
      </div>
    );
  }

  return (
    <div className='card-fade-in'>
      <div className='d-flex justify-content-between align-items-center mb-4 flex-shrink-0'>
        <Link to='new'>
          <Button>Novo prato</Button>
        </Link>
        <Button variant='outline-primary' onClick={handleResetMenu} disabled={isLoading}>
          <i className='bi bi-arrow-clockwise me-1'></i>
          Reiniciar Menu
        </Button>
      </div>

      {deleteError && (
        <Alert variant='danger' onClose={() => setError(null)} dismissible>
          {deleteError}
        </Alert>
      )}

      {updateError && (
        <Alert variant='danger' onClose={() => setUpdateError(null)} dismissible>
          {updateError}
        </Alert>
      )}

      {scalesError && (
        <Alert variant='warning' onClose={() => {}} dismissible>
          {scalesError}
        </Alert>
      )}

      {resetError && (
        <Alert variant='danger' onClose={() => setResetError(null)} dismissible>
          {resetError}
        </Alert>
      )}

      {processedFoods.length === 0 ? (
        <Alert variant='info'>Nenhum alimento encontrado.</Alert>
      ) : (
        <div className='d-flex flex-column overflow-auto gap-3'>
          {processedFoods.map((food) => (
            <SwipeableContainer
              key={food.id}
              leftSwipeAction={{
                icon: <BiTrash />,
                background: '#ea4335',
                onSwipe: () => handleDeleteFood(food.id, food.name),
              }}
              rightSwipeAction={{
                icon: food.isActive ? <BiUnlink /> : <BiLink />,
                background: food.isActive ? '#ff9800' : '#34a853',
                onSwipe: () => handleScaleAction(food),
              }}
            >
              <FoodCard
                title={food.name}
                imageUrl={food.photo}
                proteinValue={food.protein}
                carbValue={food.carbs}
                fatValue={food.fat}
                tag={{
                  text: food.isActive ? 'Ativo' : 'Inativo',
                  variant: food.isActive ? 'success' : 'danger',
                }}
              />
            </SwipeableContainer>
          ))}

          {hasNextPage && (
            <div className='d-flex justify-content-center mt-3'>
              <Button
                variant='outline-primary'
                onClick={() => fetchNextPage()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner as='span' animation='border' size='sm' className='me-2' />
                    Carregando...
                  </>
                ) : (
                  'Carregar mais alimentos'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationModal
        show={!!foodToDelete}
        onHide={cancelDelete}
        onConfirm={confirmDelete}
        foodName={foodToDelete?.name || ''}
        isLoading={deleteLoading}
      />

      {foodToUpdateScale && !foodToUpdateScale.isActive && (
        <ScaleSelectionModal
          show={!!foodToUpdateScale}
          onHide={cancelScaleAction}
          onConfirm={confirmScaleAttach}
          foodName={foodToUpdateScale.name}
          scales={scales}
          isLoading={updateLoading}
          error={updateError}
          fetchScales={fetchScales}
          scalesLoading={scalesLoading}
        />
      )}

      {foodToUpdateScale && foodToUpdateScale.isActive && (
        <ScaleDetachModal
          show={!!foodToUpdateScale}
          onHide={cancelScaleAction}
          onConfirm={confirmScaleDetach}
          foodName={foodToUpdateScale.name}
          scaleName={foodToUpdateScale.scale?.name || 'Balança desconhecida'}
          isLoading={updateLoading}
        />
      )}

      <ResetMenuModal
        show={showResetModal}
        onHide={handleCloseResetModal}
        onConfirm={confirmResetMenu}
        isResetting={isResetting}
        progress={resetProgress}
        error={resetError}
      />
    </div>
  );
};

export default Dishes;
