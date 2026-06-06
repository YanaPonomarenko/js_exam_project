import { Meal, Category, SearchResponse, CategoriesResponse } from './types.js';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export class MealAPI {
    static async searchMeal(query: string): Promise<Meal[]> {
        try {
            const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
            const data: SearchResponse = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Помилка пошуку:', error);
            return [];
        }
    }

    static async getMealById(id: string): Promise<Meal | null> {
        try {
            const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
            const data: SearchResponse = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Помилка отримання страви:', error);
            return null;
        }
    }

    static async getCategories(): Promise<Category[]> {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`);
            const data: CategoriesResponse = await response.json();
            return data.categories;
        } catch (error) {
            console.error('Помилка отримання категорій:', error);
            return [];
        }
    }

    static async getMealsByCategory(category: string): Promise<Meal[]> {
    try {
        const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
        const data = await response.json();
        
        if (data.meals) {
            return data.meals.map((meal: any) => ({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                strCategory: category,
                strArea: '',
                strInstructions: '',
                strYoutube: ''
            } as Meal));
        }
        return [];
    } catch (error) {
        console.error('Помилка:', error);
        return [];
    }

    }

    static async getRandomMeal(): Promise<Meal | null> {
        try {
            const response = await fetch(`${BASE_URL}/random.php`);
            const data: SearchResponse = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Помилка отримання випадкової страви:', error);
            return null;
        }
    }

    static async getPopularMeals(): Promise<Meal[]> {
        const meals = await this.getMealsByCategory('Beef');
        return meals.slice(0, 6);
    }
}