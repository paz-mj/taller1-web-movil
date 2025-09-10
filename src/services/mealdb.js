// src/services/mealdb.js
const BASE = 'https://www.themealdb.com/api/json/v1/1';

// Buscar por nombre
export async function searchMealsByName(q = '') {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Error al cargar recetas');
    return res.json(); // { meals: [...] }
}

// Buscar por categoría
export async function getMealsByCategory(cat) {
    const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(cat)}`);
    if (!res.ok) throw new Error('Error al cargar recetas');
    return res.json();
}

// Obtener receta por ID
export async function getMealById(id) {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`);
    if (!res.ok) throw new Error('Receta no encontrada');
    return res.json();
}
