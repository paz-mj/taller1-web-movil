export const Landing = () => {
    const el = document.createElement('section');
    el.className = 'mx-auto max-w-5xl px-4 py-10 md:py-16';

    el.innerHTML = `
    <div class="text-center mb-10">
      <h2 class="text-3xl md:text-4xl mb-2" style="color:var(--primary)">Bienvenido</h2>
      <p class="text-lg opacity-90">olaa</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <a href="#/pokemon" class="card hover:scale-[1.01] transition">
        <div class="h-28 flex items-center justify-center text-4xl">⚡</div>
        <h3 class="text-xl mt-2">Pokémon</h3>
        <p class="text-sm opacity-80">Imagen, nombre, #Pokédex, tipo, descripción.</p>
        <button class="btn-primary mt-4 w-full">Entrar</button>
      </a>

      <a href="#/recetas" class="card hover:scale-[1.01] transition">
        <div class="h-28 flex items-center justify-center text-4xl">🍜</div>
        <h3 class="text-xl mt-2">Recetas</h3>
        <p class="text-sm opacity-80">Imagen, ingredientes y preparación breve.</p>
        <button class="btn-primary mt-4 w-full">Entrar</button>
      </a>

      <a href="#/tcg" class="card hover:scale-[1.01] transition">
         <div class="h-28 flex items-center justify-center text-4xl">🎴</div>
          <h3 class="text-xl mt-2">Pokémon TCG</h3>
          <p class="text-sm opacity-80">Colección de cartas Pokémon con imagen y detalles.</p>
         <button class="btn-primary mt-4 w-full">Entrar</button>
      </a>

      <a href="#/ghibli" class="card hover:scale-[1.01] transition">
        <div class="h-28 flex items-center justify-center text-4xl">🎬</div>
        <h3 class="text-xl mt-2">Películas</h3>
        <p class="text-sm opacity-80">Portada, descripción y reseña.</p>
        <button class="btn-primary mt-4 w-full">Entrar</button>
      </a>
    </div>
  `;

    return el;
};
