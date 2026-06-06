export interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strYoutube?: string;
    [key: string]: any; 
}

export interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
}

export interface SearchResponse {
    meals: Meal[] | null;
}

export interface CategoriesResponse {
    categories: Category[];
}