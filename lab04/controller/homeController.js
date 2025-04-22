import { Filme } from "../model/filme.js";

export class HomeController {
  constructor() {
    this.LOCAL_STORAGE_KEY = "filmes";
    this.container = document.querySelector(".row.g-4");
    this.listaFilmes = [];
    this.init();
  }

  init() {
    this.carregarFilmesDoLocalStorage();
    this.renderizarFilmes();
  }

  carregarFilmesDoLocalStorage() {
    const filmesSalvos = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (filmesSalvos) {
      try {
        const filmesJSON = JSON.parse(filmesSalvos);
        this.listaFilmes = filmesJSON.map((json) => Filme.fromJSON(json));
      } catch (error) {
        console.error("Erro ao carregar filmes do localStorage:", error);
        this.listaFilmes = [];
      }
    }
  }

  renderizarFilmes() {
    if (!this.container) return;

    this.container.innerHTML = "";

    if (this.listaFilmes.length === 0) {
      this.container.innerHTML = `<p class="text-center">Nenhum filme em exibição.</p>`;
      return;
    }

    this.listaFilmes.forEach((filme) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";

      // <-- Here is where you set the innerHTML of the column with your card HTML:
      col.innerHTML = `
      <div class="card h-100">
        <img src="${filme.imagem}" alt="Poster do filme ${filme.titulo}" class="card-img-top" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${filme.titulo}</h5>
          <p class="card-text">${filme.descricao}</p>
          <a href="./ingressos.html?filmeId=${filme.id}" class="btn btn-primary mt-auto">Comprar Ingressos</a>
        </div>
      </div>
    `;

      this.container.appendChild(col);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HomeController();
});
