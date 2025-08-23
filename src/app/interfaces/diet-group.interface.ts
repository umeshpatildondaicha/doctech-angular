export interface DietGroup {
  id: string;
  groupId: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  createdByDoctorId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  duration: number;
  targetAudience: string;
  difficulty: string;
  tags: string[];
  dietItems?: DietItem[];
  diets?: string[];
}

export interface DietItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  isActive: boolean;
}
