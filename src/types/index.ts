export interface CategoriaAlimento {
  id: number;
  nome: string;
  descricao?: string;
  cor_hex?: string;
  icone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Alimento {
  id: number;
  nome: string;
  categoria_id: number;
  unidade: string;
  default_value: number;
  calorias_por_unidade: number;
  proteina_por_unidade: number;
  gordura_por_unidade: number;
  carboidrato_por_unidade: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DayData {
  date: string;
  day: string;
  calories: number;
  protein: number;
  status: string;
  meals: Meal[];
}

export interface FoodDatabase {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
}