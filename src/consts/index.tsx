import React from 'react';

export const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
export const API_DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const SUCCESS_DURATION = 1000;
export const ERROR_DURATION = 2000;

export const PRIMARY_COLOR = '#20C997';

export const CALORIE_FACTORS = {
  PROTEIN: 4,
  CARB: 4,
  FAT: 9,
};

export const NUTRIENT_FIELDS_CONFIG = [
  {
    name: 'proteins' as const,
    label: 'Proteínas (g/100g)',
    placeholder: '200',
    icon: <i className='bi bi-egg'></i>,
  },
  {
    name: 'carbs' as const,
    label: 'Carboidratos (g/100g)',
    placeholder: '200',
    icon: <i className='bi bi-lightning-charge-fill'></i>,
  },
  {
    name: 'fats' as const,
    label: 'Gorduras (g/100g)',
    placeholder: '200',
    icon: <i className='bi bi-droplet-half'></i>,
  },
];
