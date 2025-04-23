Absolutely! Here’s a **README.md** template for your Cinema Ingressos project, tailored to your code and features:

---

# 🎬 Cinema Ingressos

A simple web application for managing a cinema’s movies, rooms, sessions, and ticket sales.  
Built with vanilla JavaScript and Bootstrap, using `localStorage` for data persistence.

---

## 🚀 Features

- **Home:** View all movies in exhibition, with posters and descriptions.
- **Filmes:** Manage the list of movies.
- **Salas:** Manage cinema rooms.
- **Sessões:** List all available sessions, grouped by movie, with details and direct ticket purchase.
- **Ingressos:** Sell tickets for sessions, view and manage sold tickets.
- **Data Persistence:** All data is stored in the browser’s `localStorage`.
- **Responsive Design:** Uses Bootstrap for a mobile-friendly interface.

---

## 🗂️ Project Structure

```
/
├── css/
│   └── bootstrap.min.css
├── js/
│   └── bootstrap.bundle.min.js
├── model/
│   ├── filme.js
│   ├── ingresso.js
│   ├── sala.js
│   └── sessao.js
├── controller/
│   ├── homeController.js
│   ├── ingressoController.js
│   └── sessoesController.js
├── home.html
├── filmes.html
├── salas.html
├── sessoes.html
├── ingressos.html
└── README.md
```

---

## 🖥️ How to Run

1. **Clone or download** this repository.

2. **Install [Node.js](https://nodejs.org/)** (if you don’t have it).

3. **Install `http-server` globally** (if you don’t have it):

   ```bash
   npm install -g http-server
   ```

4. **Start the server** in your project directory:

   ```bash
   http-server
   ```

5. **Open your browser** and go to the address shown in the terminal (usually [http://127.0.0.1:8080](http://127.0.0.1:8080)).

6. **Navigate to `home.html`** or any other page to use the app.

> **Note:**  
> All data is stored in your browser’s localStorage.  
> No backend or database is required.

---

## 📝 Usage

### **Home**

- View all movies currently in exhibition.
- Click "Comprar Ingressos" to buy tickets for a movie.

### **Filmes**

- Add, edit, or remove movies.

### **Salas**

- Add, edit, or remove cinema rooms.

### **Sessões**

- View all sessions, grouped by movie.
- See session details: room, date/time, price.
- Click "Comprar Ingresso" to go directly to the ticket sale form with the session pre-selected.

### **Ingressos**

- Sell tickets for any session.
- View all sold tickets.
- Delete tickets if needed.

---

## 🛠️ Technologies

- **HTML5**
- **CSS3** (Bootstrap)
- **JavaScript (ES6 Modules)**
- **localStorage** for data

---

## 📦 Data Model

- **Filme:** id, título, descrição, imagem
- **Sala:** id, nome, capacidade
- **Sessao:** id, filmeId, salaId, dataHora, preco
- **Ingresso:** id, sessaoId, nomeCliente, cpf, assento, tipoPagamento, dataCompra

---

## 💡 Notes

- All data is stored locally in your browser.  
  To reset, clear your browser’s localStorage.
- No backend or authentication is implemented.
- For Bootstrap Icons, add this to your `<head>` if needed:
  ```html
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  ```

---

## 📷 Screenshots

_(Add screenshots of your app here if you wish!)_

---

**Enjoy your cinema management app!**

---
