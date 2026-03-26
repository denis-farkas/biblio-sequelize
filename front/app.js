const tokenKey = "biblio_demo_token";
const userKey = "biblio_demo_user";

const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");
const bookForm = document.getElementById("bookForm");
const booksList = document.getElementById("booksList");
const apiLog = document.getElementById("apiLog");
const apiBaseUrlInput = document.getElementById("apiBaseUrl");
const authState = document.getElementById("authState");
const reloadBooksBtn = document.getElementById("reloadBooksBtn");
const genreSelect = document.getElementById("genreSelect");
const apiBaseStorageKey = "biblio_demo_api";

function getApiBaseUrl() {
  const raw = apiBaseUrlInput.value.trim();
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function saveApiBaseUrl() {
  localStorage.setItem(apiBaseStorageKey, getApiBaseUrl());
}

function setLog(title, payload) {
  const stamp = new Date().toLocaleTimeString("fr-FR");
  apiLog.textContent = `[${stamp}] ${title}\n${JSON.stringify(payload, null, 2)}`;
}

function getToken() {
  return localStorage.getItem(tokenKey) || "";
}

function getStoredUser() {
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function updateAuthState() {
  const token = getToken();
  const user = getStoredUser();
  if (!token) {
    authState.textContent = "Aucun token enregistré.";
    authState.className = "mt-3 p-2 rounded small text-danger";
    return;
  }

  const short = `${token.slice(0, 12)}...${token.slice(-6)}`;
  const userLabel = user
    ? `${user.surname} (${user.role})`
    : "Utilisateur connecté";
  authState.textContent = `${userLabel} | Token: ${short}`;
  authState.className = "mt-3 p-2 rounded small text-success";
}

async function apiFetch(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const mergedOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, mergedOptions);
  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    data = { message: "Réponse non-JSON" };
  }

  if (!response.ok) {
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }

  return data;
}

async function loadGenres() {
  try {
    const data = await apiFetch("/genre/read", { method: "GET" });
    const genres = Array.isArray(data.genre) ? data.genre : [];

    genreSelect.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Choisissez un genre";
    genreSelect.appendChild(first);

    genres.forEach((g) => {
      const option = document.createElement("option");
      option.value = g.genre_name;
      option.textContent = `${g.genre_name}`;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    genreSelect.innerHTML =
      "<option value=''>Impossible de charger les genres</option>";
    setLog("Erreur loadGenres", { message: error.message });
  }
}

function renderBooks(books) {
  booksList.innerHTML = "";
  if (!books.length) {
    booksList.innerHTML = "<p class='text-muted'>Aucun livre disponible.</p>";
    return;
  }

  books.forEach((book) => {
    const bookId = Number(book.id_books ?? book.id);
    const hasValidId = Number.isInteger(bookId) && bookId > 0;
    const detailsHref = hasValidId
      ? `./book.html?id=${encodeURIComponent(bookId)}&api=${encodeURIComponent(getApiBaseUrl())}`
      : "#";

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-xl-4";

    col.innerHTML = `
      <article class="book-card">
        <h3 class="mb-1">${book.title}</h3>
        <p class="mb-1"><strong>Auteur:</strong> ${book.autor}</p>
        <p class="mb-2"><strong>Genre:</strong> ${book.genre}</p>
        <a class="btn btn-outline-primary btn-sm" href="./book.html?id=${book.id_books}&api=${encodeURIComponent(getApiBaseUrl())}">
          Voir la fiche
        </a>
      </article>
    `;

    booksList.appendChild(col);
  });
}

async function loadBooks() {
  try {
    const data = await apiFetch("/books/read", { method: "GET" });
    const books = Array.isArray(data.books) ? data.books : [];
    renderBooks(books);
    setLog("GET /books/read", data);
  } catch (error) {
    setLog("Erreur loadBooks", { message: error.message });
    booksList.innerHTML = `<p class='text-danger'>${error.message}</p>`;
  }
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const payload = {
    surname: String(formData.get("surname") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "user"),
  };

  try {
    const data = await apiFetch("/users/signUp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setLog("POST /users/signUp", data);
    signupForm.reset();
  } catch (error) {
    setLog("Erreur signUp", { message: error.message });
  }
});

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signinForm);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  try {
    const data = await apiFetch("/users/signIn", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const token = data?.user?.token || "";
    if (token) {
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(data.user));
    }
    updateAuthState();
    setLog("POST /users/signIn", data);
    signinForm.reset();
  } catch (error) {
    setLog("Erreur signIn", { message: error.message });
  }
});

bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = getToken();
  if (!token) {
    setLog("Ajout livre", {
      message: "Connectez-vous d'abord pour obtenir un token JWT.",
    });
    return;
  }

  const formData = new FormData(bookForm);
  const newGenre = String(formData.get("newGenre") || "").trim();
  let selectedGenre = String(formData.get("genreSelect") || "").trim();

  try {
    if (newGenre) {
      const createdGenre = await apiFetch("/genre/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ genre_name: newGenre }),
      });
      setLog("POST /genre/create", createdGenre);
      selectedGenre = newGenre;
      await loadGenres();
    }

    if (!selectedGenre) {
      throw new Error(
        "Veuillez choisir un genre existant ou en ajouter un nouveau.",
      );
    }

    const payload = {
      title: String(formData.get("title") || "").trim(),
      autor: String(formData.get("autor") || "").trim(),
      resume: String(formData.get("resume") || "").trim(),
      published_at: String(formData.get("published_at") || ""),
      cover: String(formData.get("cover") || "").trim(),
      genre: selectedGenre,
      verified: formData.get("verified") ? 1 : 0,
    };

    const createdBook = await apiFetch("/books/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setLog("POST /books/create", createdBook);
    bookForm.reset();
    await loadBooks();
  } catch (error) {
    setLog("Erreur createBook", { message: error.message });
  }
});

reloadBooksBtn.addEventListener("click", loadBooks);
apiBaseUrlInput.addEventListener("change", async () => {
  saveApiBaseUrl();
  await loadGenres();
  await loadBooks();
});

const savedApiBase = localStorage.getItem(apiBaseStorageKey);
if (savedApiBase) {
  apiBaseUrlInput.value = savedApiBase;
}

saveApiBaseUrl();
updateAuthState();
loadGenres();
loadBooks();
