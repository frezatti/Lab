import { Filme } from "../model/filme.js";
import { Sala } from "../model/sala.js";
import { Sessao } from "../model/sessao.js";

class SessoesController {
	constructor() {
		this.listaFilmes = [];
		this.listaSalas = [];
		this.listaSessoes = [];
		this.container = document.getElementById("listaFilmesSessoes");
		this.init();
	}

	init() {
		this.carregarDados();
		this.renderizarFilmesComSessoes();
	}

	carregarDados() {
		// Filmes
		const filmesSalvos = localStorage.getItem("filmes");
		if (filmesSalvos) {
			try {
				const filmesJSON = JSON.parse(filmesSalvos);
				this.listaFilmes = filmesJSON.map((json) => Filme.fromJSON(json));
			} catch (error) {
				this.listaFilmes = [];
			}
		}

		// Salas
		const salasSalvas = localStorage.getItem("salas");
		if (salasSalvas) {
			try {
				const salasJSON = JSON.parse(salasSalvas);
				this.listaSalas = salasJSON.map((json) => Sala.fromJSON(json));
			} catch (error) {
				this.listaSalas = [];
			}
		}

		// Sessoes
		const sessoesSalvas = localStorage.getItem("sessoes");
		if (sessoesSalvas) {
			try {
				const sessoesJSON = JSON.parse(sessoesSalvas);
				this.listaSessoes = sessoesJSON.map((json) => Sessao.fromJSON(json));
			} catch (error) {
				this.listaSessoes = [];
			}
		}
	}

	renderizarFilmesComSessoes() {
		if (!this.container) return;
		this.container.innerHTML = "";

		if (this.listaFilmes.length === 0) {
			this.container.innerHTML = `<p class="text-center">Nenhum filme em exibição.</p>`;
			return;
		}

		this.listaFilmes.forEach((filme) => {
			// Filter sessions for this movie
			const sessoesDoFilme = this.listaSessoes.filter(
				(sessao) => String(sessao.filmeId) === String(filme.id),
			);

			const col = document.createElement("div");
			col.className = "col-12 col-sm-6 col-lg-4";

			let sessoesHtml = "";
			if (sessoesDoFilme.length === 0) {
				sessoesHtml = `<div class="alert alert-warning mt-2 mb-0">Nenhuma sessão disponível para este filme.</div>`;
			} else {
				sessoesHtml = `
          <ul class="list-group list-group-flush mt-2">
            ${sessoesDoFilme
							.map((sessao) => {
								const sala = this.listaSalas.find(
									(s) => String(s.id) === String(sessao.salaId),
								);
								const salaNome = sala ? sala.nome : "Sala não encontrada";
								const dataHora = this.formatarData(sessao.dataHora);
								const preco = sessao.preco
									? Number(sessao.preco).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})
									: "R$ 0,00";
								return `
                  <li class="list-group-item d-flex flex-column">
                    <div>
                      <strong>Sala:</strong> ${salaNome}<br>
                      <strong>Data e Hora:</strong> ${dataHora}<br>
                      <strong>Preço:</strong> ${preco}
                    </div>
                    <a href="./ingressos.html?sessaoId=${sessao.id}" class="btn btn-primary btn-sm mt-2 align-self-end">
                      Comprar Ingresso
                    </a>
                  </li>
                `;
							})
							.join("")}
          </ul>
        `;
			}

			col.innerHTML = `
        <div class="card h-100">
          <img src="${filme.imagem}" alt="Poster do filme ${filme.titulo}" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${filme.titulo}</h5>
            <p class="card-text">${filme.descricao}</p>
            <h6 class="mt-3 mb-2">Sessões:</h6>
            ${sessoesHtml}
          </div>
        </div>
      `;

			this.container.appendChild(col);
		});
	}

	formatarData(data) {
		try {
			const d = new Date(data);
			return (
				d.toLocaleDateString("pt-BR") +
				" " +
				d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
			);
		} catch {
			return data;
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new SessoesController();
});
