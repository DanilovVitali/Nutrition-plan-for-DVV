export interface MealItem {
  time: string;
  name: string;
  dishes: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface DayMeals {
  day: string;
  meals: MealItem[];
  hydration: string;
  totalNutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
} 