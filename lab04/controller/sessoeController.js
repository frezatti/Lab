import { Sessao } from "../model/sessao.js";
import { Filme } from "../model/filme.js";
import { Sala } from "../model/sala.js";

export class SessaoController {
	constructor() {
		this.listaSessoes = [];
		this.listaFilmes = [];
		this.listaSalas = [];
		this.idEmEdicao = null;
		this.idParaExcluir = null;
		this.LOCAL_STORAGE_KEY = "sessoes";

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
		const btnSalvarSessao = document.getElementById("btnSalvarSessao");
		const btnExcluirSessao = document.getElementById("btnExcluirSessao");
		const cancelBtns = document.querySelectorAll(
			".btn-secondary[data-bs-dismiss='modal']",
		);

		if (btnNovo) btnNovo.addEventListener("click", this.abrirModalCadastro);
		if (btnSalvarSessao) btnSalvarSessao.addEventListener("click", this.salvar);
		if (btnExcluirSessao)
			btnExcluirSessao.addEventListener("click", () =>
				this.excluir(this.idParaExcluir),
			);

		if (btnFecharModal) {
			btnFecharModal.addEventListener("click", () => {
				this.limparFormulario();
				this.fecharModal("idModalSessao");
			});
		}

		cancelBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				this.limparFormulario();
				this.fecharModal(btn.closest(".modal").id);
			});
		});

		const btnBuscar = document.querySelector(".btn-primary[type='button']");
		const inputBusca = document.querySelector(
			"input[placeholder='Buscar sessão']",
		);

		if (btnBuscar && inputBusca) {
			btnBuscar.addEventListener("click", () =>
				this.buscarSessoes(inputBusca.value),
			);
			inputBusca.addEventListener("keypress", (e) => {
				if (e.key === "Enter") {
					this.buscarSessoes(inputBusca.value);
				}
			});
		}

		this.carregarDados();
	}

	carregarDados() {
		// Carregar filmes
		const filmesSalvos = localStorage.getItem("filmes");
		if (filmesSalvos) {
			try {
				const filmesJSON = JSON.parse(filmesSalvos);
				this.listaFilmes = filmesJSON.map((json) => Filme.fromJSON(json));
			} catch (error) {
				console.error("Erro ao carregar filmes do localStorage:", error);
				this.listaFilmes = [];
			}
		}

		// Carregar salas
		const salasSalvas = localStorage.getItem("salas");
		if (salasSalvas) {
			try {
				const salasJSON = JSON.parse(salasSalvas);
				this.listaSalas = salasJSON.map((json) => Sala.fromJSON(json));
			} catch (error) {
				console.error("Erro ao carregar salas do localStorage:", error);
				this.listaSalas = [];
			}
		}

		// Carregar sessões
		const sessoesSalvas = localStorage.getItem(this.LOCAL_STORAGE_KEY);
		if (sessoesSalvas) {
			try {
				const sessoesJSON = JSON.parse(sessoesSalvas);
				this.listaSessoes = sessoesJSON.map((json) => Sessao.fromJSON(json));
				this.atualizarTabela(this.listaSessoes);
			} catch (error) {
				console.error("Erro ao carregar sessões do localStorage:", error);
				this.listaSessoes = [];
			}
		}

		// Atualizar selects
		this.preencherSelects();
	}

	preencherSelects() {
		const selectFilme = document.getElementById("filme");
		const selectSala = document.getElementById("sala");

		if (selectFilme) {
			selectFilme.innerHTML = '<option value="">Selecione um filme</option>';
			this.listaFilmes.forEach((filme) => {
				const option = document.createElement("option");
				option.value = filme.id;
				option.textContent = filme.titulo;
				selectFilme.appendChild(option);
			});
		}

		if (selectSala) {
			selectSala.innerHTML = '<option value="">Selecione uma sala</option>';
			this.listaSalas.forEach((sala) => {
				const option = document.createElement("option");
				option.value = sala.id;
				option.textContent = `${sala.nome} (${sala.tipo} - ${sala.capacidade} lugares)`;
				selectSala.appendChild(option);
			});
		}
	}

	buscarSessoes(termo) {
		if (!termo) {
			this.atualizarTabela(this.listaSessoes);
			return;
		}

		const termoLower = termo.toLowerCase();
		const resultados = this.listaSessoes.filter((sessao) => {
			const filme = this.listaFilmes.find((f) => f.id === sessao.filmeId);
			const sala = this.listaSalas.find((s) => s.id === sessao.salaId);

			return (
				(filme && filme.titulo.toLowerCase().includes(termoLower)) ||
				(sala && sala.nome.toLowerCase().includes(termoLower)) ||
				sessao.idioma.toLowerCase().includes(termoLower) ||
				sessao.formato.toLowerCase().includes(termoLower)
			);
		});

		this.atualizarTabela(resultados);
	}

	salvar() {
		const form = document.getElementById("formSessao");
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const sessao = this.criarSessaoDoFormulario();

		if (this.idEmEdicao) {
			const index = this.listaSessoes.findIndex(
				(s) => s.id === this.idEmEdicao,
			);
			if (index !== -1) {
				this.listaSessoes[index] = sessao;
			}
		} else {
			this.listaSessoes.push(sessao);
		}

		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaSessoes);
		this.limparFormulario();

		this.fecharModal("idModalSessao");
	}

	criarSessaoDoFormulario() {
		return new Sessao(
			this.idEmEdicao || Date.now(),
			document.getElementById("filme").value,
			document.getElementById("sala").value,
			document.getElementById("dataHora").value,
			parseFloat(document.getElementById("preco").value),
			document.getElementById("idioma").value,
			document.getElementById("formato").value,
		);
	}

	salvarNoLocalStorage() {
		localStorage.setItem(
			this.LOCAL_STORAGE_KEY,
			JSON.stringify(this.listaSessoes),
		);
	}

	atualizarTabela(sessoes = this.listaSessoes) {
		const tbody =
			document.getElementById("tabelaSessoes") ||
			document.querySelector("tbody");
		if (!tbody) return;

		tbody.innerHTML = "";

		if (sessoes.length === 0) {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td colspan="7" class="text-center">Nenhuma sessão cadastrada</td>`;
			tbody.appendChild(tr);
			return;
		}

		sessoes.forEach((sessao) => {
			const filme = this.listaFilmes.find((f) => f.id == sessao.filmeId) || {
				titulo: "Filme não encontrado",
			};
			const sala = this.listaSalas.find((s) => s.id == sessao.salaId) || {
				nome: "Sala não encontrada",
			};

			const tr = document.createElement("tr");
			tr.innerHTML = `
                <td>${sessao.id}</td>
                <td><strong>${filme.titulo}</strong></td>
                <td>${sala.nome}</td>
                <td>${this.formatarData(sessao.dataHora)}</td>
                <td>R$ ${sessao.preco.toFixed(2)}</td>
                <td>${sessao.idioma} - ${sessao.formato}</td>
                <td>
                  <button class="btn btn-warning btn-sm btn-editar" data-id="${sessao.id}" title="Editar sessão">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-danger btn-sm ms-2 btn-excluir" data-id="${sessao.id}" title="Excluir sessão">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
            `;
			tbody.appendChild(tr);

			tr.querySelector(".btn-editar").addEventListener("click", () =>
				this.abrirModalEdicao(sessao),
			);
			tr.querySelector(".btn-excluir").addEventListener("click", () =>
				this.abrirModalExcluir(sessao.id),
			);
		});
	}

	excluir(id) {
		if (!id) return;

		this.listaSessoes = this.listaSessoes.filter((sessao) => sessao.id !== id);
		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaSessoes);
		this.idParaExcluir = null;

		this.fecharModal("modalExcluirSessao");
	}

	abrirModalCadastro() {
		this.limparFormulario();
		this.preencherSelects();

		this.idEmEdicao = null;

		document.getElementById("idModalSessaoTitulo").textContent =
			"Cadastrar Nova Sessão";

		this.abrirModal("idModalSessao");
	}

	abrirModalEdicao(sessao) {
		if (!sessao) return;

		this.limparFormulario();
		this.preencherSelects();

		this.idEmEdicao = sessao.id;

		document.getElementById("filme").value = sessao.filmeId;
		document.getElementById("sala").value = sessao.salaId;
		document.getElementById("dataHora").value = sessao.dataHora;
		document.getElementById("preco").value = sessao.preco;
		document.getElementById("idioma").value = sessao.idioma;
		document.getElementById("formato").value = sessao.formato;

		document.getElementById("idModalSessaoTitulo").textContent =
			"Editar Sessão";

		this.abrirModal("idModalSessao");
	}

	abrirModalExcluir(id) {
		if (!id) return;

		this.idParaExcluir = id;

		const sessao = this.listaSessoes.find((s) => s.id === id);

		if (sessao) {
			const filme = this.listaFilmes.find((f) => f.id == sessao.filmeId) || {
				titulo: "Filme não encontrado",
			};
			const sala = this.listaSalas.find((s) => s.id == sessao.salaId) || {
				nome: "Sala não encontrada",
			};

			const msgConfirmacao = document.querySelector(
				"#modalExcluirSessao .modal-body h5",
			);
			if (msgConfirmacao) {
				msgConfirmacao.textContent = `Deseja realmente excluir a sessão do filme "${filme.titulo}" na sala "${sala.nome}"?`;
			}
		}

		this.abrirModal("modalExcluirSessao");
	}

	limparFormulario() {
		const form = document.getElementById("formSessao");
		if (form) {
			form.reset();
			this.idEmEdicao = null;
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

	formatarData(dataHora) {
		if (!dataHora) return "";

		const data = new Date(dataHora);
		if (isNaN(data)) return "";

		// Format date as dd/mm/yyyy hh:mm
		const dia = String(data.getDate()).padStart(2, "0");
		const mes = String(data.getMonth() + 1).padStart(2, "0");
		const ano = data.getFullYear();

		const horas = String(data.getHours()).padStart(2, "0");
		const minutos = String(data.getMinutes()).padStart(2, "0");

		return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
	}
}

// Initialize the controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
	window.sessaoController = new SessaoController();
});
