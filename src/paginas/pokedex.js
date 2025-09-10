// src/pages/pokemon.js
import {
    getPokemonList,
    getPokemonByIdOrName,
    getSpecies,
    getTypes,
    parseIdFromUrl,
    spriteUrl,
    pickFlavorText,
} from '../services/pokeapi.js';

function badgeType(t) {
    return `<span class="inline-block rounded-full px-3 py-1 text-xs border"
            style="border-color: var(--muted); background: #fff">${t}</span>`;
}

function padId(n) {
    return `#${String(n).padStart(3, '0')}`;
}

export const PokemonPage = () => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-5xl px-4 py-10';

    el.innerHTML = `
    <h2 class="text-2xl md:text-3xl mb-6" style="color:var(--primary)">Pokémon</h2>

    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      <input id="search" type="text" placeholder="Buscar por nombre o # (ej: pikachu o 25)"
        class="border rounded-xl px-4 py-3 w-full" />
      <select id="typeFilter" class="border rounded-xl px-4 py-3 w-full">
        <option value="">Todos los tipos</option>
      </select>
      <button id="reload" class="btn-primary w-full">Recargar</button>
    </div>

    <div id="grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"></div>

    <div class="mt-8 flex justify-center">
      <button id="loadMore" class="btn-primary">Cargar más</button>
    </div>

    <a href="#/" class="mt-8 inline-block underline">← Volver</a>
  `;

    const $grid = el.querySelector('#grid');
    const $search = el.querySelector('#search');
    const $type = el.querySelector('#typeFilter');
    const $loadMore = el.querySelector('#loadMore');
    const $reload = el.querySelector('#reload');

    let page = 1;
    const limit = 24;
    let items = [];        // { id, name, types[], img }
    let allTypes = [];

    // Renderiza tarjetas
    function render(list) {
        $grid.innerHTML = list.map(p => `
      <a href="#/pokemon/${p.id}" class="card hover:scale-[1.01] transition">
        <img src="${p.img}" alt="${p.name}" class="img-centered max-h-64 rounded-xl" loading="lazy"/>
        <div class="flex items-center justify-between">
          <h3 class="text-lg">${p.name}</h3>
          <span class="text-sm opacity-70">${padId(p.id)}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          ${p.types.map(badgeType).join('')}
        </div>
      </a>
    `).join('');
    }

    function applyFilters() {
        const q = $search.value.trim().toLowerCase();
        const t = $type.value;
        let filtered = items;

        if (q) {
            filtered = filtered.filter(p =>
                p.name.includes(q) || String(p.id) === q.replace('#','')
            );
        }
        if (t) {
            filtered = filtered.filter(p => p.types.includes(t));
        }
        render(filtered);
    }

    async function loadTypes() {
        allTypes = await getTypes();
        $type.innerHTML = `<option value="">Todos los tipos</option>` +
            allTypes.map(x => `<option value="${x}">${x}</option>`).join('');
    }

    async function fetchPage() {
        // skeleton simple
        $grid.innerHTML += Array.from({ length: 8 }, () => `
      <div class="card animate-pulse h-48"></div>
    `).join('');

        const data = await getPokemonList(page, limit); // names+urls
        const details = await Promise.all(
            data.results.map(async (r) => {
                const id = parseIdFromUrl(r.url);
                const d = await getPokemonByIdOrName(id);
                return {
                    id: d.id,
                    name: d.name,
                    types: d.types.map(t => t.type.name),
                    img: spriteUrl(d.id),
                };
            })
        );

        // quita skeletons “restando” lo que acabamos de inyectar
        $grid.innerHTML = $grid.innerHTML.replace(/<div class="card animate-pulse h-48"><\/div>/g, '');
        items = items.concat(details);
        applyFilters();
    }

    // Eventos
    $search.addEventListener('input', applyFilters);
    $type.addEventListener('change', applyFilters);
    $loadMore.addEventListener('click', async () => {
        page += 1;
        await fetchPage();
    });
    $reload.addEventListener('click', async () => {
        page = 1; items = []; $grid.innerHTML = '';
        await fetchPage();
    });

    // Init
    (async () => {
        try {
            await loadTypes();
            await fetchPage();
        } catch (e) {
            $grid.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};

// ---------- Detalle ----------
export const PokemonDetailPage = (idOrName) => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-3xl px-4 py-10';

    el.innerHTML = `
    <div class="mb-6">
      <a href="#/pokemon" class="underline">← Volver a Pokémon</a>
    </div>
    <div id="content" class="card"></div>
  `;

    const $content = el.querySelector('#content');

    (async () => {
        try {
            $content.innerHTML = `<div class="animate-pulse h-64"></div>`;

            const data = await getPokemonByIdOrName(idOrName);
            const species = await getSpecies(data.id);
            const desc = pickFlavorText(species, ['es', 'en']);

            const types = data.types.map(t => t.type.name);
            const img = spriteUrl(data.id);

            $content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center justify-center">
            <img src="${img}" alt="${data.name}" class="img-centered max-h-64 rounded-xl"/>
          </div>
          <div>
            <h2 class="text-3xl" style="color:var(--primary)">${data.name}</h2>
            <p class="opacity-70 mb-2">${padId(data.id)}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              ${types.map(badgeType).join('')}
            </div>
            <p class="leading-relaxed">${desc || 'Sin descripción disponible.'}</p>
          </div>
        </div>
      `;
        } catch (e) {
            $content.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};

