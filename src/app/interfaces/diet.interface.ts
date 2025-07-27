export interface Diet {
  dietId: string;
  name: string;
  description: string;
  dietType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  createdByDoctorId: string;
  createdAt: Date;
  isActive: boolean;
  mealPlan?: MealPlan[];
}

export interface MealPlan {
  mealId: string;
  mealName: string;
  mealTime: string;
  foods: FoodItem[];
  totalCalories: number;
}

export interface FoodItem {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} 