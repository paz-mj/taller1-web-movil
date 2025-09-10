// src/paginas/tcg.js
import { getCards, getCardById } from '../services/tcg.js';

function cardView(c) {
    const img = c.images?.small || 'https://via.placeholder.com/200x280?text=No+Image';
    return `
    <a href="#/tcg/${c.id}" class="card hover:scale-[1.01] transition">
      <img src="${img}" alt="${c.name}" 
           class="img-centered max-h-64 rounded-xl" loading="lazy"/>
      <h3 class="text-lg">${c.name}</h3>
      <p class="text-sm opacity-80">${c.supertype} • ${c.set?.name || ''}</p>
    </a>
  `;
}

export const TCGPage = () => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-5xl px-4 py-10';

    el.innerHTML = `
    <h2 class="text-2xl md:text-3xl mb-6" style="color:var(--primary)">Cartas Pokémon TCG</h2>

    <div id="grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"></div>

    <div class="mt-6 flex justify-center">
      <button id="loadMore" class="btn-primary">Cargar más</button>
    </div>

    <a href="#/" class="mt-8 inline-block underline">← Volver</a>
  `;

    const $grid = el.querySelector('#grid');
    const $loadMore = el.querySelector('#loadMore');
    let page = 1;

    async function load() {
        try {
            $grid.innerHTML += Array.from({ length: 6 }, () => `
             <div class="card animate-pulse h-64 rounded-xl bg-gray-200"></div>
             `).join('');

            const cards = await getCards(page, 20);
            $grid.innerHTML = cards.map(cardView).join('');
        } catch (e) {
            $grid.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    }

    $loadMore.addEventListener('click', () => {
        page++;
        load();
    });

    load();

    return el;
};

// ----------- Detalle -----------
export const TCGDetailPage = (id) => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-3xl px-4 py-10';

    el.innerHTML = `
    <div class="mb-6">
      <a href="#/tcg" class="underline">← Volver a Cartas</a>
    </div>
    <div id="content" class="card"></div>
  `;

    const $content = el.querySelector('#content');

    (async () => {
        try {
            $content.innerHTML = `<div class="card animate-pulse h-80 rounded-xl bg-gray-200"></div>`;

            const c = await getCardById(id);

            const img = c.images?.large || c.images?.small;

            // Extraer ataques y habilidades
            const attacks = (c.attacks || []).map(a => `
        <li>
          <strong>${a.name}</strong> (${a.damage || '—'})<br/>
          <span class="text-sm opacity-80">${a.text || ''}</span>
        </li>
      `).join('');

            const abilities = (c.abilities || []).map(ab => `
        <li>
          <strong>${ab.name}</strong>: ${ab.text}
        </li>
      `).join('');

            $content.innerHTML = `
        <div>
          <img src="${img}" alt="${c.name}" class="img-centered max-h-64 rounded-xl"/>
          <h2 class="text-3xl mb-2" style="color:var(--primary)">${c.name}</h2>
          <p class="opacity-70 mb-2">Tipo: ${c.supertype}</p>
          <p class="opacity-70 mb-2">Subtipo: ${c.subtypes?.join(', ') || '—'}</p>
          <p class="opacity-70 mb-2">HP: ${c.hp || '—'}</p>
          <p class="opacity-70 mb-2">Energía: ${c.types?.join(', ') || '—'}</p>
          <p class="opacity-70 mb-2">Rareza: ${c.rarity || '—'}</p>
          <p class="opacity-70 mb-2">Expansión: ${c.set?.name || '—'}</p>

          ${abilities ? `
            <h3 class="mt-4 font-semibold">Habilidades</h3>
            <ul class="list-disc pl-5 mb-4">${abilities}</ul>
          ` : ''}

          ${attacks ? `
            <h3 class="mt-4 font-semibold">Ataques</h3>
            <ul class="list-disc pl-5 mb-4">${attacks}</ul>
          ` : ''}

        </div>
      `;
        } catch (e) {
            $content.innerHTML = `<p class="text-red-600">Error: ${e.message}</p>`;
        }
    })();

    return el;
};

