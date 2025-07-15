export interface ProductScheduleTime {
  time: string;
  price: number;
}
export interface ProductSchedule {
  best_time: string | null;
  closed: boolean;
  available_times: ProductScheduleTime[];
}

export interface StoreConfig {
  supports_dynamic_pricing: boolean;
  icon: string;
}

export interface Schedule {
  day_of_week: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
}

export interface Store {
  id: number;
  name: string;
  identifier: string;
  address: string;
  zipcode: string;
  store_config: StoreConfig;
  schedules: Schedule[];
  created_at: string;
  updated_at: string;
}

export interface ProductChild {
  id: number;
  name: string;
  description?: string;
  duration: number;
  max_price: number;
  min_price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  start_price: number;
  min_duration: number;
  max_duration: number;
  photo: string;
  children: ProductChild[];
}

export interface Section {
  id: number;
  store: Store;
  title: string;
  description: string;
  products: Product[];
}

interface Options {
  page: number;
  pages: number;
  results: number;
  size: number;
}

export interface ResponseData<T> {
  data: T[];
  options: Options;
}

export interface Scale {
  id: number;
  name: string;
  serial: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  photo: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  scale: Scale | null;
}

export interface ProcessedFood {
  id: number;
  name: string;
  description: string;
  photo: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  scale: Scale | null;
  isActive: boolean;
}

export interface FoodMeasurement {
  id: number;
  food: Food;
  weight: number;
}

export interface Meal {
  id: number;
  created_at: string;
  finished: boolean;
  final_price: number;
  total_calories: number;
  total_carbs: number;
  total_fat: number;
  total_protein: number;
  total_weight: number;
  food_measurements: FoodMeasurement[];
}

export interface ProcessedMeal {
  id: number;
  createdAt: Date;
  finished: boolean;
  finalPrice: number;
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalProtein: number;
  totalWeight: number;
  foodMeasurements: FoodMeasurement[];
  chartSlices: Array<{
    id: number;
    percentage: number;
    imageSrc: string;
    label: string;
    details?: string;
  }>;
}
