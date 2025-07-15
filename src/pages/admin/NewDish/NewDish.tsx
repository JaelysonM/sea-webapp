import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CALORIE_FACTORS, NUTRIENT_FIELDS_CONFIG } from 'consts';

import { ImageUpload } from 'components/elements';

import useCreateFood from './useCreateFood';
import { useNutritionApi } from './useNutritionApi';

const initialFormState = {
  name: '',
  description: '',
  proteins: '',
  carbs: '',
  fats: '',
};

const NewDish: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    fetchNutritionData,
    setError: setNutritionError,
  } = useNutritionApi();
  const {
    createFood,
    isLoading: createLoading,
    error: createError,
    setError: setCreateError,
  } = useCreateFood();

  const isLoading = nutritionLoading || createLoading;
  const error = nutritionError || createError;

  const calories = useMemo(() => {
    const p = parseFloat(formData.proteins) || 0;
    const c = parseFloat(formData.carbs) || 0;
    const f = parseFloat(formData.fats) || 0;
    return p * CALORIE_FACTORS.PROTEIN + c * CALORIE_FACTORS.CARB + f * CALORIE_FACTORS.FAT;
  }, [formData.proteins, formData.carbs, formData.fats]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const handleImageSelect = useCallback((file: File | null) => {
    setSelectedImage(file);
  }, []);

  const handleSearch = useCallback(async () => {
    setNutritionError(null);
    const results = await fetchNutritionData(formData.name);
    if (results && results.length > 0) {
      const item = results[0];
      setFormData((prev) => ({
        ...prev,
        proteins: String(item.protein_g),
        carbs: String(item.carbohydrates_total_g),
        fats: String(item.fat_total_g),
      }));
    }
  }, [formData.name, fetchNutritionData, setNutritionError]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCreateError(null);

      const submissionData = {
        name: formData.name,
        description: formData.description || undefined,
        photo: selectedImage || undefined,
        protein: parseFloat(formData.proteins) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fats) || 0,
        calories,
      };

      const result = await createFood(submissionData);
      if (result) {
        navigate('/admin/dishes');
      }
    },
    [formData, selectedImage, calories, createFood, setCreateError, navigate],
  );

  const clearError = useCallback(() => {
    setNutritionError(null);
    setCreateError(null);
  }, [setNutritionError, setCreateError]);

  return (
    <div className='card-fade-in'>
      <h1 className='h2 fw-bold mb-4'>Novo prato</h1>
      {error && (
        <Alert variant='danger' onClose={clearError} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formDishName'>
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              name='name'
              placeholder='Ex: 100g de feijão cozido'
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Button
              variant='outline-secondary'
              onClick={handleSearch}
              disabled={isLoading || !formData.name}
            >
              {nutritionLoading ? (
                <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
              ) : (
                <i className='bi bi-globe'></i>
              )}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formDishDescription'>
          <Form.Label>Descrição (Opcional)</Form.Label>
          <Form.Control
            as='textarea'
            rows={2}
            name='description'
            placeholder='Descrição adicional do alimento...'
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formDishImage'>
          <Form.Label>Foto do alimento</Form.Label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={selectedImage}
            disabled={isLoading}
          />
        </Form.Group>

        {NUTRIENT_FIELDS_CONFIG.map((field) => (
          <Form.Group key={field.name} className='mb-3' controlId={`form${field.name}`}>
            <Form.Label>{field.label}</Form.Label>
            <InputGroup>
              <Form.Control
                type='number'
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                step='0.1'
                min='0'
                required
              />
              <InputGroup.Text>{field.icon}</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        ))}

        <Form.Group className='mb-4' controlId='formCalories'>
          <Form.Label>Calorias por porção (100g)</Form.Label>
          <Form.Control type='text' value={`${calories.toFixed(0)} kcal`} readOnly disabled />
        </Form.Group>

        <div className='d-grid gap-2'>
          <Button variant='primary' type='submit' size='lg' disabled={isLoading}>
            {createLoading ? (
              <>
                <Spinner as='span' animation='border' size='sm' className='me-2' />
                Salvando...
              </>
            ) : (
              'Salvar Alimento'
            )}
          </Button>
          <Button
            variant='outline-secondary'
            size='lg'
            onClick={() => navigate('/admin/dishes')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewDish;
