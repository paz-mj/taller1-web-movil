const BASE = 'https://api.pokemontcg.io/v2';
const cacheCards = {};

export async function getCards(page = 1, pageSize = 12) {
    const key = `page-${page}`;
    if (cacheCards[key]) return cacheCards[key]; // ← cache del listado

    const res = await fetch(`${BASE}/cards?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Error al cargar cartas');
    const data = await res.json();
    cacheCards[key] = data.data;
    return data.data;
}

export async function getCardById(id) {
    if (cacheCards[id]) return cacheCards[id]; // ← cache del detalle

    const res = await fetch(`${BASE}/cards/${id}`);
    if (!res.ok) throw new Error('Carta no encontrada');
    const data = await res.json();
    cacheCards[id] = data.data;
    return data.data;
}


