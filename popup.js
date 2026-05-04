const searchInput = document.getElementById("card-search");
const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("results");

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  results.innerHTML = '<p class="placeholder">Loading...</p>';

  chrome.runtime.sendMessage({ type: "FETCH_PRICE", cardName: query }, (response) => {
    if (chrome.runtime.lastError) {
      showError("Extension error. Please try again.");
      return;
    }
    if (response.error) {
      showError(response.error);
    } else {
      showResults(response.results);
    }
  });
}

function showResults(cards) {
  if (!cards || cards.length === 0) {
    results.innerHTML = '<p class="placeholder">No results found.</p>';
    return;
  }

  results.innerHTML = cards
    .map(
      (card) => `
      <div class="card-result">
        <div class="card-name">${escapeHtml(card.name)}</div>
        <div class="card-price">${escapeHtml(card.price)}</div>
      </div>
    `
    )
    .join("");
}

function showError(msg) {
  results.innerHTML = `<p class="error">${escapeHtml(msg)}</p>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
