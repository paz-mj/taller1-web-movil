// src/router.js
import { Landing } from './paginas/landing.js';
import { PokemonPage, PokemonDetailPage } from './paginas/pokedex.js';
import { TCGPage, TCGDetailPage } from './paginas/tcg.js';
import { GhibliPage, GhibliDetailPage } from './paginas/ghibli.js';
import { RecetasPage, RecetaDetailPage } from './paginas/recetas.js';

const staticRoutes = {
    '': Landing,
    '#/': Landing,
    '#/pokemon': PokemonPage,
    '#/recetas': RecetasPage,
    '#/tcg': TCGPage,
    '#/ghibli': GhibliPage,
};

export function router() {
    const app = document.getElementById('app');
    const hash = location.hash || '#/';

    // Ruta dinámica: Pokémon detalle
    if (hash.startsWith('#/pokemon/')) {
        const id = hash.split('/')[2];
        app.innerHTML = '';
        app.appendChild(PokemonDetailPage(id));
        return;
    }

    // Ruta dinámica: Ghibli detalle
    if (hash.startsWith('#/ghibli/')) {
        const id = hash.split('/')[2];
        app.innerHTML = '';
        app.appendChild(GhibliDetailPage(id));
        return;
    }

    // Rutas estáticas
    const Page = staticRoutes[hash] || Landing;
    app.innerHTML = '';
    app.appendChild(Page());

    if (hash.startsWith('#/recetas/')) {
        const id = hash.split('/')[2];
        app.innerHTML = '';
        app.appendChild(RecetaDetailPage(id));
        return;
    }

    if (hash.startsWith('#/tcg/')) {
        const id = hash.split('/')[2];
        app.innerHTML = '';
        app.appendChild(TCGDetailPage(id));
        return;
    }
}

