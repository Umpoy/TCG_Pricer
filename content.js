const STORAGE_KEY = "tcgPricerFloorPrice";


const wrapper = document.createElement("div");
Object.assign(wrapper.style, {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  zIndex: "99999",
  display: "flex",
  gap: "8px",
  alignItems: "center",
});


const matchBtn = document.createElement("button");
matchBtn.textContent = "⇄ Match Prices";
Object.assign(matchBtn.style, {
  padding: "10px 18px",
  background: "#4caf7d",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontFamily: "sans-serif",
  fontSize: "14px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
});
matchBtn.addEventListener("mouseenter", () => (matchBtn.style.background = "#3d9e6a"));
matchBtn.addEventListener("mouseleave", () => (matchBtn.style.background = "#4caf7d"));
matchBtn.addEventListener("click", () => {
  const floor = parseFloat(localStorage.getItem(STORAGE_KEY) || "0.25");
  applyPriceFloor(floor);
});

const settingsBtn = document.createElement("button");
settingsBtn.textContent = "⚙";
settingsBtn.title = "Settings";
Object.assign(settingsBtn.style, {
  padding: "0",
  width: "38px",
  height: "38px",
  background: "#6b6b6b",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontFamily: "sans-serif",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
});
settingsBtn.addEventListener("mouseenter", () => (settingsBtn.style.background = "#555555"));
settingsBtn.addEventListener("mouseleave", () => (settingsBtn.style.background = "#6b6b6b"));
settingsBtn.addEventListener("click", openModal);

wrapper.appendChild(matchBtn);
wrapper.appendChild(settingsBtn);
document.body.appendChild(wrapper);

function openModal() {
  const saved = localStorage.getItem(STORAGE_KEY) || "0.25";

  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.5)",
    zIndex: "999999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const box = document.createElement("div");
  Object.assign(box.style, {
    background: "#1a1a2e",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "24px",
    width: "280px",
    fontFamily: "sans-serif",
    color: "#e0e0e0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  });

  box.innerHTML = `
    <div style="font-size:16px;font-weight:bold;color:#f0c040;margin-bottom:12px;">Settings</div>
    <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Set minimum price — saved for future runs.</div>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
      <span style="font-size:16px;color:#e0e0e0;">$</span>
      <input id="tcg-floor-input" type="number" min="0" step="0.01" value="${saved}"
        style="flex:1;padding:8px;border:1px solid #555;border-radius:4px;
               background:#16213e;color:#e0e0e0;font-size:15px;outline:none;" />
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button id="tcg-cancel-btn"
        style="padding:8px 14px;background:transparent;color:#aaa;border:1px solid #555;
               border-radius:4px;cursor:pointer;font-size:13px;">Cancel</button>
      <button id="tcg-save-btn"
        style="padding:8px 14px;background:#4caf7d;color:#fff;border:none;
               border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">Save</button>
    </div>
  `;

  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  const input = box.querySelector("#tcg-floor-input");
  input.focus();
  input.select();

  function close() { backdrop.remove(); }

  box.querySelector("#tcg-cancel-btn").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });

  box.querySelector("#tcg-save-btn").addEventListener("click", () => {
    const floor = parseFloat(input.value);
    if (isNaN(floor) || floor < 0) {
      input.style.borderColor = "#e06060";
      return;
    }
    localStorage.setItem(STORAGE_KEY, floor.toFixed(2));
    close();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") box.querySelector("#tcg-save-btn").click();
    if (e.key === "Escape") close();
  });
}


function applyPriceFloor(floor) {
  $('.product-listing__market-price span input').each(function() {
    $(this).click();
  });

  $(".validation-message-container")
    .find("input[aria-label='Marketplace price for undefined - undefined - undefined - undefined']")
    .each(function() {
      let current = parseFloat($(this).val());
      if (isNaN(current) || current < floor) {
        $(this)
          .val(floor.toFixed(2))
          .trigger("input")
          .trigger("change");
      }
    });
}
