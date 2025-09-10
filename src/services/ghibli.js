// src/services/ghibli.js
const BASE = 'https://ghibliapi.vercel.app';

export async function getFilms() {
    const res = await fetch(`${BASE}/films`);
    if (!res.ok) throw new Error('Error al cargar películas');
    return res.json(); // array de films
}

export async function getFilm(id) {
    const res = await fetch(`${BASE}/films/${id}`);
    if (!res.ok) throw new Error('Película no encontrada');
    return res.json();
}

