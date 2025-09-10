// src/pages/ghibli.js
import { getFilms, getFilm } from '../services/ghibli.js';

function cardFilm(f) {
    return `
    <a href="#/ghibli/${f.id}" class="card hover:scale-[1.01] transition">
      <img src="${f.image}" alt="${f.title}" class="img-centered max-h-64 rounded-xl" loading="lazy"/>
      <h3 class="text-lg">${f.title}</h3>
      <p class="text-sm opacity-80">${f.release_date} • Dir: ${f.director}</p>
    </a>
  `;
}

export const GhibliPage = () => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-5xl px-4 py-10';

    el.innerHTML = `
    <h2 class="text-2xl md:text-3xl mb-6" style="color:var(--primary)">Películas Studio Ghibli</h2>
    <div id="grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"></div>
    <a href="#/" class="mt-8 inline-block underline">← Volver</a>
  `;

    const $grid = el.querySelector('#grid');

    (async () => {
        try {
            $grid.innerHTML = '<p>Cargando...</p>';
            const films = await getFilms();
            $grid.innerHTML = films.map(cardFilm).join('');
        } catch (e) {
            $grid.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};

// ----------- Detalle -----------
export const GhibliDetailPage = (id) => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-3xl px-4 py-10';

    el.innerHTML = `
    <div class="mb-6">
      <a href="#/ghibli" class="underline">← Volver a Películas</a>
    </div>
    <div id="content" class="card"></div>
  `;

    const $content = el.querySelector('#content');

    (async () => {
        try {
            $content.innerHTML = `<div class="animate-pulse h-64"></div>`;

            const film = await getFilm(id);

            $content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img src="${film.image}" alt="${film.title}" class="img-centered max-h-64 rounded-xl"/>
          </div>
          <div>
            <h2 class="text-3xl mb-2" style="color:var(--primary)">${film.title}</h2>
            <p class="opacity-70 mb-2">${film.release_date} • Dir: ${film.director}</p>
            <p class="leading-relaxed">${film.description}</p>
          </div>
        </div>
      `;
        } catch (e) {
            $content.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};
