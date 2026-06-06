const FAVORITES_KEY = 'mealDB_favorites';

export class FavoritesManager {
    private favorites: Set<string> = new Set();

    constructor() {
        this.loadFavorites();
    }

    private loadFavorites(): void {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            const favoritesArray = JSON.parse(saved);
            this.favorites = new Set(favoritesArray);
        }
        this.updateFavoritesCount();
    }

    private saveFavorites(): void {
        const favoritesArray = Array.from(this.favorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
        this.updateFavoritesCount();
    }

    updateFavoritesCount(): void {
        const countSpan = document.getElementById('favoritesCount');
        if (countSpan) {
            countSpan.textContent = this.favorites.size.toString();
        }
    }

    addFavorite(mealId: string): void {
        this.favorites.add(mealId);
        this.saveFavorites();
    }

    removeFavorite(mealId: string): void {
        this.favorites.delete(mealId);
        this.saveFavorites();
    }

    isFavorite(mealId: string): boolean {
        return this.favorites.has(mealId);
    }

    getAllFavorites(): string[] {
        return Array.from(this.favorites);
    }

    toggleFavorite(mealId: string): boolean {
        if (this.isFavorite(mealId)) {
            this.removeFavorite(mealId);
            return false;
        } else {
            this.addFavorite(mealId);
            return true;
        }
    }
}