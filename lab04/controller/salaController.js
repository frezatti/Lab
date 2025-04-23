import { Sala } from "../model/sala.js";

export class SalaController {
	constructor() {
		this.listaSalas = [];
		this.idEmEdicao = null;
		this.idParaExcluir = null;
		this.LOCAL_STORAGE_KEY = "salas";

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
		const btnSalvarSala = document.getElementById("btnSalvarSala");
		const btnExcluirSala = document.getElementById("btnExcluirSala");
		const cancelBtns = document.querySelectorAll(
			".btn-secondary[data-bs-dismiss='modal']",
		);

		if (btnNovo) btnNovo.addEventListener("click", this.abrirModalCadastro);
		if (btnSalvarSala) btnSalvarSala.addEventListener("click", this.salvar);
		if (btnExcluirSala)
			btnExcluirSala.addEventListener("click", () =>
				this.excluir(this.idParaExcluir),
			);

		if (btnFecharModal) {
			btnFecharModal.addEventListener("click", () => {
				this.limparFormulario();
				this.fecharModal("idModalSala");
			});
		}

		cancelBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				this.limparFormulario();
				this.fecharModal(btn.closest(".modal").id);
			});
		});

		// Search input and button (optional, if you have them)
		const btnBuscar = document.getElementById("btnBuscarSala");
		const inputBusca = document.getElementById("inputBuscaSala");

		if (btnBuscar && inputBusca) {
			btnBuscar.addEventListener("click", () =>
				this.buscarSalas(inputBusca.value),
			);
			inputBusca.addEventListener("keypress", (e) => {
				if (e.key === "Enter") {
					this.buscarSalas(inputBusca.value);
				}
			});
		}

		this.carregarSalasDoLocalStorage();
	}

	buscarSalas(termo) {
		if (!termo) {
			this.atualizarTabela(this.listaSalas);
			return;
		}

		const termoLower = termo.toLowerCase();
		const resultados = this.listaSalas.filter(
			(sala) =>
				sala.nome.toLowerCase().includes(termoLower) ||
				sala.tipo.toLowerCase().includes(termoLower),
		);

		this.atualizarTabela(resultados);
	}

	salvar() {
		const form = document.getElementById("formSala");
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const sala = this.criarSalaDoFormulario();

		if (this.idEmEdicao) {
			const index = this.listaSalas.findIndex((s) => s.id === this.idEmEdicao);
			if (index !== -1) {
				this.listaSalas[index] = sala;
			}
		} else {
			this.listaSalas.push(sala);
		}

		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaSalas);
		this.limparFormulario();
		this.fecharModal("idModalSala");
	}

	criarSalaDoFormulario() {
		return new Sala(
			this.idEmEdicao || Date.now(),
			document.getElementById("nome").value.trim(),
			parseInt(document.getElementById("capacidade").value, 10),
			document.getElementById("tipo").value,
		);
	}

	salvarNoLocalStorage() {
		localStorage.setItem(
			this.LOCAL_STORAGE_KEY,
			JSON.stringify(this.listaSalas),
		);
	}

	carregarSalasDoLocalStorage() {
		const salasSalvas = localStorage.getItem(this.LOCAL_STORAGE_KEY);

		if (salasSalvas) {
			try {
				const salasJSON = JSON.parse(salasSalvas);
				this.listaSalas = salasJSON.map((json) => Sala.fromJSON(json));
				this.atualizarTabela(this.listaSalas);
			} catch (error) {
				console.error("Erro ao carregar salas do localStorage:", error);
				this.listaSalas = [];
			}
		}
	}

	atualizarTabela(salas = this.listaSalas) {
		const tbody = document.getElementById("tabelaSalas");
		if (!tbody) return;

		tbody.innerHTML = "";

		if (salas.length === 0) {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td colspan="5" class="text-center">Nenhuma sala cadastrada</td>`;
			tbody.appendChild(tr);
			return;
		}

		salas.forEach((sala) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `
        <td>${sala.id}</td>
        <td><strong>${sala.nome}</strong></td>
        <td>${sala.capacidade} lugares</td>
        <td>${sala.tipo}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar" data-id="${sala.id}" title="Editar sala">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-danger btn-sm ms-2 btn-excluir" data-id="${sala.id}" title="Excluir sala">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `;
			tbody.appendChild(tr);

			tr.querySelector(".btn-editar").addEventListener("click", () =>
				this.abrirModalEdicao(sala),
			);
			tr.querySelector(".btn-excluir").addEventListener("click", () =>
				this.abrirModalExcluir(sala.id),
			);
		});
	}

	excluir(id) {
		if (!id) return;

		this.listaSalas = this.listaSalas.filter((sala) => sala.id !== id);
		this.salvarNoLocalStorage();
		this.atualizarTabela(this.listaSalas);
		this.idParaExcluir = null;
		this.fecharModal("modalExcluirSala");
	}

	abrirModalCadastro() {
		this.limparFormulario();
		this.idEmEdicao = null;
		document.getElementById("idModalSalaTitulo").textContent =
			"Cadastrar Nova Sala";
		this.abrirModal("idModalSala");
	}

	abrirModalEdicao(sala) {
		if (!sala) return;

		this.idEmEdicao = sala.id;

		document.getElementById("nome").value = sala.nome;
		document.getElementById("capacidade").value = sala.capacidade;
		document.getElementById("tipo").value = sala.tipo;

		document.getElementById("idModalSalaTitulo").textContent = "Editar Sala";

		this.abrirModal("idModalSala");
	}

	abrirModalExcluir(id) {
		if (!id) return;

		this.idParaExcluir = id;

		const sala = this.listaSalas.find((s) => s.id === id);

		if (sala) {
			const msgConfirmacao = document.querySelector(
				"#modalExcluirSala .modal-body h5",
			);
			if (msgConfirmacao) {
				msgConfirmacao.textContent = `Deseja realmente excluir a sala "${sala.nome}"?`;
			}
		}

		this.abrirModal("modalExcluirSala");
	}

	limparFormulario() {
		const form = document.getElementById("formSala");
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
}

document.addEventListener("DOMContentLoaded", () => {
	const salaController = new SalaController();
	window.salaController = salaController;
});
