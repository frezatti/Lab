import { Filme } from "../model/filme.js";

export class FilmeController {
	constructor() {
		this.listaFilmes = [];
		this.idEmEdicao = null;
		this.idParaExcluir = null;
		this.imagemAtual = null; // Initialize current image
		this.LOCAL_STORAGE_KEY = "filmes";

		this.salvar = this.salvar.bind(this);
		this.excluir = this.excluir.bind(this);
		this.abrirModalCadastro = this.abrirModalCadastro.bind(this);
		this.abrirModalEdicao = this.abrirModalEdicao.bind(this);
		this.abrirModalExcluir = this.abrirModalExcluir.bind(this);
		this.limparFormulario = this.limparFormulario.bind(this);
		this.fecharModal = this.fecharModal.bind(this);

		this.init();
	}

	init() {
		const btnNovo = document.getElementById("btnNovo");
		const btnFecharModal = document.getElementById("btnFecharModal");
		const btnSalvarFilme = document.getElementById("btnSalvarFilme");
		const btnExcluirFilme = document.getElementById("btnExcluirFilme");
		const cancelBtns = document.querySelectorAll(
			".btn-secondary[data-bs-dismiss='modal']",
		);

		btnNovo.addEventListener("click", this.abrirModalCadastro);
		btnSalvarFilme.addEventListener("click", this.salvar);
		btnExcluirFilme.addEventListener("click", () =>
			this.excluir(this.idParaExcluir),
		);

		btnFecharModal.addEventListener("click", () => {
			this.limparFormulario();
			this.fecharModal("idModalFilme");
		});

		cancelBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				this.limparFormulario();
				this.fecharModal(btn.closest(".modal").id);
			});
		});

		const btnBuscar = document.querySelector(".btn-primary[type='button']");
		const inputBusca = document.querySelector(
			"input[placeholder='Digite o título do filme']",
		);

		if (btnBuscar && inputBusca) {
			btnBuscar.addEventListener("click", () =>
				this.buscarFilmes(inputBusca.value),
			);
			inputBusca.addEventListener("keypress", (e) => {
				if (e.key === "Enter") {
					this.buscarFilmes(inputBusca.value);
				}
			});
		}

		this.carregarFilmesDoLocalStorage();
	}

	buscarFilmes(termo) {
		if (!termo) {
			this.atualizarTabela(this.listaFilmes);
			return;
		}

		const termoLower = termo.toLowerCase();
		const resultados = this.listaFilmes.filter(
			(filme) =>
				filme.titulo.toLowerCase().includes(termoLower) ||
				filme.genero.toLowerCase().includes(termoLower),
		);

		this.atualizarTabela(resultados);
	}

	salvar() {
		const form = document.getElementById("formFilme");
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const fileInput = document.getElementById("imagem");
		const file = fileInput.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const base64Image = reader.result; // Base64 string

				const filme = this.criarFilmeDoFormulario(base64Image);
				this.salvarFilme(filme);
			};
			reader.onerror = () => {
				console.error("Erro ao ler arquivo de imagem");
				const filme = this.criarFilmeDoFormulario();
				this.salvarFilme(filme);
			};
			reader.readAsDataURL(file);
		} else {
			// No new image selected, keep existing or default
			const filme = this.criarFilmeDoFormulario();
			this.salvarFilme(filme);
		}
	}

	salvarFilme(filme) {
		if (this.idEmEdicao) {
			const index = this.listaFilmes.findIndex((f) => f.id === this.idEmEdicao);
			if (index !== -1) {
				this.listaFilmes[index] = filme;
			}
		} else {
			this.listaFilmes.push(filme);
		}

		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaFilmes);
		this.limparFormulario();
		this.fecharModal("idModalFilme");
	}

	criarFilmeDoFormulario(base64Image) {
		return new Filme(
			this.idEmEdicao || Date.now(),
			document.getElementById("titulo").value.trim(),
			document.getElementById("descricao").value.trim(),
			document.getElementById("genero").value.trim(),
			document.getElementById("classificacao").value,
			parseInt(document.getElementById("duracao").value, 10),
			document.getElementById("dataEstreia").value,
			base64Image || this.imagemAtual || "./img/placeholder-image.jpg",
		);
	}

	salvarNoLocalStorage() {
		localStorage.setItem(
			this.LOCAL_STORAGE_KEY,
			JSON.stringify(this.listaFilmes),
		);
	}

	carregarFilmesDoLocalStorage() {
		const filmesSalvos = localStorage.getItem(this.LOCAL_STORAGE_KEY);

		if (filmesSalvos) {
			try {
				const filmesJSON = JSON.parse(filmesSalvos);
				this.listaFilmes = filmesJSON.map((json) => Filme.fromJSON(json));
				this.atualizarTabela(this.listaFilmes);
			} catch (error) {
				console.error("Erro ao carregar filmes do localStorage:", error);
				this.listaFilmes = [];
			}
		}
	}

	atualizarTabela(filmes = this.listaFilmes) {
		const tbody =
			document.getElementById("tabelaFilmes") ||
			document.querySelector("tbody");
		if (!tbody) return;

		tbody.innerHTML = "";

		if (filmes.length === 0) {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td colspan="7" class="text-center">Nenhum filme cadastrado</td>`;
			tbody.appendChild(tr);
			return;
		}

		filmes.forEach((filme) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `
        <td>${filme.id}</td>
        <td><strong>${filme.titulo}</strong></td>
        <td>${filme.genero}</td>
        <td>${filme.classificacao}</td>
        <td>${filme.duracao}</td>
        <td>${this.formatarData(filme.dataEstreia)}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar" data-id="${filme.id}" title="Editar filme">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-danger btn-sm ms-2 btn-excluir" data-id="${filme.id}" title="Excluir filme">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `;
			tbody.appendChild(tr);

			tr.querySelector(".btn-editar").addEventListener("click", () =>
				this.abrirModalEdicao(filme),
			);
			tr.querySelector(".btn-excluir").addEventListener("click", () =>
				this.abrirModalExcluir(filme.id),
			);
		});
	}

	excluir(id) {
		if (!id) return;

		this.listaFilmes = this.listaFilmes.filter((filme) => filme.id !== id);
		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaFilmes);
		this.idParaExcluir = null;
		this.fecharModal("modalExcluirFilme");
	}

	abrirModalCadastro() {
		this.limparFormulario();
		this.idEmEdicao = null;
		this.imagemAtual = null; // Clear previous image
		document.getElementById("idModalFilmeTitulo").textContent =
			"Cadastrar Novo Filme";
		this.abrirModal("idModalFilme");
	}

	abrirModalEdicao(filme) {
		if (!filme) return;

		this.idEmEdicao = filme.id;
		this.imagemAtual = filme.imagem; // Store current image base64 or URL

		document.getElementById("titulo").value = filme.titulo;
		document.getElementById("descricao").value = filme.descricao || "";
		document.getElementById("genero").value = filme.genero;
		document.getElementById("classificacao").value = filme.classificacao;
		document.getElementById("duracao").value = filme.duracao;
		document.getElementById("dataEstreia").value = filme.dataEstreia;

		// Clear file input so user can upload new image if desired
		document.getElementById("imagem").value = "";

		document.getElementById("idModalFilmeTitulo").textContent = "Editar Filme";

		this.abrirModal("idModalFilme");
	}

	abrirModalExcluir(id) {
		if (!id) return;

		this.idParaExcluir = id;

		const filme = this.listaFilmes.find((f) => f.id === id);

		if (filme) {
			const msgConfirmacao = document.querySelector(
				"#modalExcluirFilme .modal-body h5",
			);
			if (msgConfirmacao) {
				msgConfirmacao.textContent = `Deseja realmente excluir o filme "${filme.titulo}"?`;
			}
		}

		this.abrirModal("modalExcluirFilme");
	}

	limparFormulario() {
		const form = document.getElementById("formFilme");
		if (form) {
			form.reset();
			this.idEmEdicao = null;
			this.imagemAtual = null;
		}
	}

	abrirModal(modalId) {
		const modalElement = document.getElementById(modalId);
		if (!modalElement) return;

		const modal = new bootstrap.Modal(modalElement);
		modal.show();
	}

	fecharModal(modalId) {
		const modalElement = document.getElementById(modalId);
		if (!modalElement) return;

		const modalInstance = bootstrap.Modal.getInstance(modalElement);
		if (modalInstance) {
			modalInstance.hide();
		}
	}

	formatarData(data) {
		try {
			const d = new Date(data);
			return d.toLocaleDateString("pt-BR");
		} catch (e) {
			return data;
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const filmeController = new FilmeController();
	window.filmeController = filmeController;
});
