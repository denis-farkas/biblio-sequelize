const params = new URLSearchParams(window.location.search);
const bookId = params.get("id") || params.get("id_books") || "";
const apiFromQuery = params.get("api") || "";

const apiLog = document.getElementById("apiLog");
const bookDetails = document.getElementById("bookDetails");

function getApiBaseUrl() {
  const fallback =
    localStorage.getItem("biblio_demo_api") || "http://localhost:3000";
  const picked = apiFromQuery || fallback;
  return picked.endsWith("/") ? picked.slice(0, -1) : picked;
}

function log(title, payload) {
  const stamp = new Date().toLocaleTimeString("fr-FR");
  apiLog.textContent = `[${stamp}] ${title}\n${JSON.stringify(payload, null, 2)}`;
}

function renderBook(book) {
  bookDetails.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-4">
        <img src="${book.cover}" alt="Couverture de ${book.title}" class="book-cover" onerror="this.style.display='none'" />
      </div>
      <div class="col-12 col-md-8">
        <h2 class="h4 mb-3">${book.title}</h2>
        <p><strong>Auteur:</strong> ${book.autor}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Date de publication:</strong> ${book.published_at}</p>
        <p><strong>Vérifié:</strong> ${book.verified ? "Oui" : "Non"}</p>
        <p class="mb-0"><strong>Résumé:</strong><br />${book.resume}</p>
      </div>
    </div>
  `;
}

async function loadBook() {
  if (!bookId) {
    bookDetails.innerHTML =
      "<p class='text-danger mb-0'>Identifiant de livre invalide dans l'URL.</p>";
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/books/readone/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Impossible de charger ce livre.");
    }

    renderBook(data.book);
    log(`GET /books/readone/${bookId}`, data);
  } catch (error) {
    bookDetails.innerHTML = `<p class='text-danger mb-0'>${error.message}</p>`;
    log("Erreur loadBook", { message: error.message });
  }
}

loadBook();
