// src/services/pokeapi.js
const BASE = 'https://pokeapi.co/api/v2';

export function spriteUrl(id) {
    // Artwork oficial (bonito y grande)
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function parseIdFromUrl(url) {
    // .../pokemon/25/ -> "25"
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
}

export async function getPokemonList(page = 1, limit = 24) {
    const offset = (page - 1) * limit;
    const res = await fetch(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error('Error al cargar Pokémon');
    return res.json(); // { results: [{name, url}], count, next, previous }
}

export async function getPokemonByIdOrName(idOrName) {
    const res = await fetch(`${BASE}/pokemon/${idOrName}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    return res.json(); // incluye types, id, name, etc.
}

export async function getSpecies(idOrName) {
    const res = await fetch(`${BASE}/pokemon-species/${idOrName}`);
    if (!res.ok) throw new Error('Species no encontrada');
    return res.json(); // flavor_text_entries, etc.
}

export async function getTypes() {
    const res = await fetch(`${BASE}/type`);
    if (!res.ok) throw new Error('Error al cargar tipos');
    const data = await res.json();
    // Filtramos algunos "raros" si no los quieres
    const omit = new Set(['shadow', 'unknown']);
    return data.results.map(t => t.name).filter(n => !omit.has(n));
}

export function pickFlavorText(speciesJson, preferred = ['es', 'en']) {
    if (!speciesJson?.flavor_text_entries) return '';
    for (const lang of preferred) {
        const entry = speciesJson.flavor_text_entries.find(e => e.language?.name === lang);
        if (entry?.flavor_text) {
            return entry.flavor_text.replace(/\f|\n|\r/g, ' ').trim();
        }
    }
    // fallback a cualquiera
    const any = speciesJson.flavor_text_entries[0];
    return any ? any.flavor_text.replace(/\f|\n|\r/g, ' ').trim() : '';
}


