import React from 'react';

export const CALORIE_FACTORS = {
  PROTEIN: 4,
  CARB: 4,
  FAT: 9,
};

export const NUTRIENT_FIELDS_CONFIG = [
  {
    name: 'proteins' as const,
    label: 'Proteínas (g)',
    placeholder: '200',
    icon: <i className='bi bi-egg'></i>,
  },
  {
    name: 'carbs' as const,
    label: 'Carboidratos (g)',
    placeholder: '200',
    icon: <i className='bi bi-lightning-charge-fill'></i>,
  },
  {
    name: 'fats' as const,
    label: 'Gorduras (g)',
    placeholder: '200',
    icon: <i className='bi bi-droplet-half'></i>,
  },
];
