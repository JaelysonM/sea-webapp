import { Meal, ProcessedMeal } from '@types';

export const processMeal = (meal: Meal | null): ProcessedMeal => {
  if (!meal) {
    return {
      id: 0,
      createdAt: new Date(),
      finished: false,
      finalPrice: 0,
      totalCalories: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalProtein: 0,
      totalWeight: 0,
      foodMeasurements: [],
      chartSlices: [],
    };
  }

  const chartSlices = meal.food_measurements.map((measurement) => {
    const percentage =
      meal.total_weight > 0 ? Math.round((measurement.weight / meal.total_weight) * 100) : 0;

    return {
      id: measurement.id,
      percentage,
      imageSrc: measurement.food.photo || '',
      label: measurement.food.name,
      details: `${measurement.weight.toFixed(0)}g`,
    };
  });

  return {
    id: meal.id,
    createdAt: new Date(meal.created_at),
    finished: meal.finished,
    finalPrice: meal.final_price,
    totalCalories: meal.total_calories,
    totalCarbs: meal.total_carbs,
    totalFat: meal.total_fat,
    totalProtein: meal.total_protein,
    totalWeight: meal.total_weight,
    foodMeasurements: meal.food_measurements,
    chartSlices,
  };
};

export default { processMeal };
