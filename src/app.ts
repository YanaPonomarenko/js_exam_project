import { MealAPI } from './api.js';
import { FavoritesManager } from './favorites.js';

declare const bootstrap: any;

class MealApp {
    private favorites: FavoritesManager;
    private modal: any;

    constructor() {
        this.favorites = new FavoritesManager();
        this.modal = new bootstrap.Modal(document.getElementById('mealModal'));
        this.setupEvents();
        this.loadCategories();
        this.loadPopularMeals();
    }

    private setupEvents(): void {
        const form = document.getElementById('searchForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('searchInput') as HTMLInputElement;
            if (input.value) {
                const meals = await MealAPI.searchMeal(input.value);
                this.showMeals(meals, `Пошук: ${input.value}`);
            }
        });

        document.getElementById('homeLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadPopularMeals();
        });

        document.getElementById('favoritesLink')?.addEventListener('click', () => {
            this.loadFavorites();
        });

        const randomHandler = () => this.loadRandomMeal();
        document.getElementById('randomMealBtn')?.addEventListener('click', randomHandler);
        document.getElementById('randomMealFloatBtn')?.addEventListener('click', randomHandler);
    }

    private async loadCategories(): Promise<void> {
        const cats = await MealAPI.getCategories();
        const container = document.getElementById('categoriesContainer');
        if (!container) return;

        container.innerHTML = '';
        cats.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary w-100';
            btn.textContent = cat.strCategory;
            btn.onclick = () => this.loadMealsByCategory(cat.strCategory);
            
            const col = document.createElement('div');
            col.className = 'col-md-3 col-sm-6';
            col.appendChild(btn);
            container.appendChild(col);
        });
    }

    private async loadMealsByCategory(category: string): Promise<void> {
        this.showMeals(await MealAPI.getMealsByCategory(category), `Категорія: ${category}`);
    }

    private async loadPopularMeals(): Promise<void> {
        this.showMeals(await MealAPI.getPopularMeals(), 'Популярні страви');
    }

    private async loadRandomMeal(): Promise<void> {
        const meal = await MealAPI.getRandomMeal();
        if (meal) this.showMeals([meal], 'Випадкова страва');
    }

    private async loadFavorites(): Promise<void> {
        const ids = this.favorites.getAllFavorites();
        if (ids.length === 0) {
            const container = document.getElementById('mealsContainer');
            if (container) container.innerHTML = '<p class="text-center p-5">Немає обраних</p>';
            return;
        }
        
        const meals = [];
        for (const id of ids) {
            const meal = await MealAPI.getMealById(id);
            if (meal) meals.push(meal);
        }
        this.showMeals(meals, 'Обрані страви');
    }

    private showMeals(meals: any[], title: string): void {
        const container = document.getElementById('mealsContainer');
        const titleEl = document.getElementById('sectionTitle');
        if (!container) return;
        
        if (titleEl) titleEl.textContent = title;
        container.innerHTML = '';

        if (!meals?.length) {
            container.innerHTML = '<p class="text-center p-5">Страв не знайдено</p>';
            return;
        }

        meals.forEach(meal => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-lg-3';
            
            const card = document.createElement('div');
            card.className = 'card h-100 shadow-sm';
            
            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.className = 'card-img-top';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            card.appendChild(img);
            
            const body = document.createElement('div');
            body.className = 'card-body';
            
            const h5 = document.createElement('h5');
            h5.textContent = meal.strMeal;
            body.appendChild(h5);
            
            const btn1 = document.createElement('button');
            btn1.className = 'btn btn-primary w-100 mb-2';
            btn1.textContent = 'Детальніше';
            btn1.onclick = () => this.showDetails(meal.idMeal);
            body.appendChild(btn1);
            
            const btn2 = document.createElement('button');
            btn2.className = 'btn btn-outline-warning w-100';
            btn2.textContent = this.favorites.isFavorite(meal.idMeal) ? 'В обраних' : 'Додати';
            btn2.onclick = () => this.toggleFavorite(meal.idMeal);
            body.appendChild(btn2);
            
            card.appendChild(body);
            col.appendChild(card);
            container.appendChild(col);
        });
    }

    private async showDetails(id: string): Promise<void> {
        const meal = await MealAPI.getMealById(id);
        if (!meal) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        if (!modalTitle || !modalBody) return;
        
        modalTitle.textContent = meal.strMeal;
        modalBody.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = meal.strMealThumb;
        img.className = 'img-fluid rounded mb-3';
        modalBody.appendChild(img);
        
        const h4 = document.createElement('h4');
        h4.textContent = 'Інгредієнти:';
        modalBody.appendChild(h4);
        
        const ul = document.createElement('ul');
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const meas = meal[`strMeasure${i}`];
            if (ing?.trim()) {
                const li = document.createElement('li');
                li.textContent = `${meas || ''} ${ing}`.trim();
                ul.appendChild(li);
            }
        }
        modalBody.appendChild(ul);
        
        const h42 = document.createElement('h4');
        h42.textContent = 'Інструкція:';
        modalBody.appendChild(h42);
        
        const p = document.createElement('p');
        p.textContent = meal.strInstructions || 'Немає інструкції';
        modalBody.appendChild(p);
        
        this.modal.show();
    }

    private async toggleFavorite(id: string): Promise<void> {
        this.favorites.toggleFavorite(id);
        await this.loadPopularMeals();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MealApp();
});