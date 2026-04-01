import { Category } from "@/entities/category/types";

export type CategoryDto = Pick<Category, "name" | "slug">;

export type UpdateCategoryDto = Partial<CategoryDto>;

export type CategoryFormState = CategoryDto;
