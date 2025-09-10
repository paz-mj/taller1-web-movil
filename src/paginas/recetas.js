// src/paginas/recetas.js
import { searchMealsByName, getMealById } from '../services/mealdb.js';

function cardMeal(m) {
    return `
    <a href="#/recetas/${m.idMeal}" class="card hover:scale-[1.01] transition">
      <img src="${m.strMealThumb}" alt="${m.strMeal}" 
           class="img-centered max-h-64 rounded-xl" loading="lazy"/>
      <h3 class="text-lg">${m.strMeal}</h3>
    </a>
  `;
}

export const RecetasPage = () => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-5xl px-4 py-10';

    el.innerHTML = `
    <h2 class="text-2xl md:text-3xl mb-6" style="color:var(--primary)">Recetas</h2>

    <div class="mb-6">
      <input id="search" type="text" placeholder="Buscar receta por nombre..."
        class="border rounded-xl px-4 py-3 w-full" />
    </div>

    <div id="grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"></div>

    <a href="#/" class="mt-8 inline-block underline">← Volver</a>
  `;

    const $grid = el.querySelector('#grid');
    const $search = el.querySelector('#search');

    async function load(q = '') {
        try {
            $grid.innerHTML = '<p>Cargando...</p>';
            const data = await searchMealsByName(q);
            if (!data.meals) {
                $grid.innerHTML = '<p>No se encontraron recetas.</p>';
                return;
            }
            $grid.innerHTML = data.meals.map(cardMeal).join('');
        } catch (e) {
            $grid.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    }

    $search.addEventListener('input', e => {
        const val = e.target.value.trim();
        load(val);
    });

    load(); // carga inicial

    return el;
};

// ----------- Detalle -----------
export const RecetaDetailPage = (id) => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-3xl px-4 py-10';

    el.innerHTML = `
    <div class="mb-6">
      <a href="#/recetas" class="underline">← Volver a Recetas</a>
    </div>
    <div id="content" class="card"></div>
  `;

    const $content = el.querySelector('#content');

    (async () => {
        try {
            $content.innerHTML = `<div class="animate-pulse h-64"></div>`;
            const data = await getMealById(id);
            const meal = data.meals[0];

            // Armar ingredientes
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ing = meal[`strIngredient${i}`];
                const meas = meal[`strMeasure${i}`];
                if (ing && ing.trim()) {
                    ingredients.push(`${meas} ${ing}`.trim());
                }
            }

            $content.innerHTML = `
        <div>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
               class="img-centered max-h-64 rounded-xl"/>
          <h2 class="text-3xl mb-2" style="color:var(--primary)">${meal.strMeal}</h2>
          <h3 class="text-lg font-semibold mb-2">Ingredientes</h3>
          <ul class="list-disc pl-5 mb-4">
            ${ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
          <h3 class="text-lg font-semibold mb-2">Preparación</h3>
          <p class="leading-relaxed">${meal.strInstructions}</p>
        </div>
      `;
        } catch (e) {
            $content.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};

