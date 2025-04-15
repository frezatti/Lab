class Person {
    constructor(nome, email, idade, sexo, cidade, interesses, mensagem) {
        this.nome = nome;
        this.email = email;
        this.idade = idade;
        this.sexo = sexo;
        this.cidade = cidade;
        this.interesses = interesses;
        this.mensagem = mensagem;
    }
}

class PersonController {
    constructor() {
        this.people = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('btnSalvar').addEventListener('click', (e) => this.save(e));
        document.getElementById('btnExcluir').addEventListener('click', (e) => this.delete(e));
        document.getElementById('btnCarregar').addEventListener('click', (e) => this.loadData(e));
    }

    save(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const idade = document.getElementById('idade').value;
        const sexo = document.querySelector('input[name="sexo"]:checked').value;
        const cidade = document.getElementById('cidade').value;
        const interesses = Array.from(document.querySelectorAll('input[name="interesses[]"]:checked')).map(el => el.value);
        const mensagem = document.getElementById('mensagem').value;

        const person = new Person(nome, email, idade, sexo, cidade, interesses, mensagem);
        this.people.push(person);
        this.updateTable();
        this.clearForm();
    }

    editPerson(event) {
        const row = event.target.closest('tr');
        const index = row.rowIndex - 1;
        const person = this.people[index];

        document.getElementById('nome').value = person.nome;
        document.getElementById('email').value = person.email;
        document.getElementById('idade').value = person.idade;
        document.querySelector(`input[name="sexo"][value="${person.sexo}"]`).checked = true;
        document.getElementById('cidade').value = person.cidade;

        document.querySelectorAll('input[name="interesses[]"]').forEach(el => {
            el.checked = person.interesses.includes(el.value);
        });

        document.getElementById('mensagem').value = person.mensagem;

        this.people.splice(index, 1);
        this.updateTable();
    }

    delete(e) {
        e.preventDefault();
        if (e.target.tagName === 'BUTTON') {
            const row = e.target.closest('tr');
            const index = row.rowIndex - 1;
            this.people.splice(index, 1);
            this.updateTable();
        } else {
            if (this.people.length > 0) {
                this.people.pop();
                this.updateTable();
            }
        }
    }

    loadData(e) {
        e.preventDefault();
        const sampleData = [
            new Person("John Doe", "john@example.com", 28, "M", "1", ["sports", "technology"], "Tech enthusiast"),
            new Person("Jane Smith", "jane@example.com", 24, "F", "2", ["music", "movies"], "Music lover")
        ];

        this.people = [...this.people, ...sampleData];
        this.updateTable();
    }

    updateTable() {
        const table = document.getElementById('tabela');
        table.innerHTML = '';

        this.people.forEach((person, index) => {
            const row = table.insertRow();
            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = person.nome;
            row.insertCell(2).innerText = person.email;
            row.insertCell(3).innerText = person.idade;
            row.insertCell(4).innerText = person.sexo === 'M' ? 'Male' : 'Female';

            const cityNames = {
                "1": "New York",
                "2": "Los Angeles",
                "3": "Chicago",
                "4": "Houston",
                "5": "Phoenix"
            };

            row.insertCell(5).innerText = cityNames[person.cidade] || person.cidade;

            const actionCell = row.insertCell(6);

            const btnEdit = document.createElement('button');
            btnEdit.innerText = 'Edit';
            btnEdit.style.marginRight = '5px';
            btnEdit.style.backgroundColor = '#4CAF50';
            btnEdit.style.color = 'white';
            btnEdit.style.border = 'none';
            btnEdit.style.borderRadius = '4px';
            btnEdit.style.padding = '5px 10px';
            btnEdit.style.cursor = 'pointer';

            const btnDelete = document.createElement('button');
            btnDelete.innerText = 'Delete';
            btnDelete.style.backgroundColor = '#f44336';
            btnDelete.style.color = 'white';
            btnDelete.style.border = 'none';
            btnDelete.style.borderRadius = '4px';
            btnDelete.style.padding = '5px 10px';
            btnDelete.style.cursor = 'pointer';

            actionCell.appendChild(btnEdit);
            actionCell.appendChild(btnDelete);

            btnEdit.addEventListener('click', (event) => this.editPerson(event));
            btnDelete.addEventListener('click', (event) => this.delete(event));
        });
    }

    clearForm() {
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('idade').value = '';
        document.querySelectorAll('input[name="sexo"]').forEach(el => el.checked = false);
        document.getElementById('cidade').value = '';
        document.querySelectorAll('input[name="interesses[]"]').forEach(el => el.checked = false);
        document.getElementById('mensagem').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PersonController();
});
