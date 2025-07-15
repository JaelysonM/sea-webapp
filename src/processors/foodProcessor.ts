import { Food, ProcessedFood } from '@types';

/**
 * Processador para converter dados de Food do formato da API para o formato utilizado na aplicação
 * Define se um alimento está ativo ou inativo baseado na presença da scale
 */
export class FoodProcessor {
  /**
   * Processa um único item de Food
   * @param food - Dados do alimento vindo da API
   * @returns Dados processados do alimento com status de ativo/inativo
   */
  static processFood(food: Food): ProcessedFood {
    return {
      ...food,
      isActive: food.scale !== null && food.scale !== undefined,
    };
  }

  /**
   * Processa uma lista de Foods
   * @param foods - Array de alimentos vindos da API
   * @returns Array de alimentos processados com status de ativo/inativo
   */
  static processFoodList(foods: Food[]): ProcessedFood[] {
    return foods.map(this.processFood);
  }

  /**
   * Filtra apenas alimentos ativos
   * @param processedFoods - Array de alimentos processados
   * @returns Array contendo apenas alimentos ativos
   */
  static getActiveFoods(processedFoods: ProcessedFood[]): ProcessedFood[] {
    return processedFoods.filter((food) => food.isActive);
  }

  /**
   * Filtra apenas alimentos inativos
   * @param processedFoods - Array de alimentos processados
   * @returns Array contendo apenas alimentos inativos
   */
  static getInactiveFoods(processedFoods: ProcessedFood[]): ProcessedFood[] {
    return processedFoods.filter((food) => !food.isActive);
  }

  /**
   * Obtém estatísticas dos alimentos
   * @param processedFoods - Array de alimentos processados
   * @returns Objeto com contadores de alimentos ativos e inativos
   */
  static getFoodStats(processedFoods: ProcessedFood[]): {
    total: number;
    active: number;
    inactive: number;
  } {
    const active = this.getActiveFoods(processedFoods);
    const inactive = this.getInactiveFoods(processedFoods);

    return {
      total: processedFoods.length,
      active: active.length,
      inactive: inactive.length,
    };
  }
}

export default FoodProcessor;
