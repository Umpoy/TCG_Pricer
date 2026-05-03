const STORAGE_KEY_FLOOR   = "tcgPricerFloorPrice";
const STORAGE_KEY_MODE    = "tcgPricerMode";
const STORAGE_KEY_PERCENT = "tcgPricerPercent";


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
matchBtn.addEventListener("click", () => applyPricing());

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
  const raw         = localStorage.getItem(STORAGE_KEY_MODE) || "adjust";
  // treat legacy "floor"/"percent" values as "adjust"
  const savedMode   = raw === "match" ? "match" : "adjust";
  const savedFloor   = localStorage.getItem(STORAGE_KEY_FLOOR)   || "0.25";
  const savedPercent = localStorage.getItem(STORAGE_KEY_PERCENT) || "0";

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
    width: "300px",
    fontFamily: "sans-serif",
    color: "#e0e0e0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  });

  const segStyle = (active) =>
    `flex:1;padding:8px 4px;background:${active ? "#4caf7d" : "transparent"};` +
    `color:${active ? "#fff" : "#aaa"};border:none;cursor:pointer;font-size:12px;` +
    `font-weight:${active ? "bold" : "normal"};transition:background 0.15s,color 0.15s;`;

  box.innerHTML = `
    <div style="font-size:16px;font-weight:bold;color:#f0c040;margin-bottom:16px;">Settings</div>

    <div style="display:flex;border:1px solid #555;border-radius:6px;overflow:hidden;margin-bottom:16px;">
      <button id="tcg-mode-adjust" style="${segStyle(savedMode === "adjust")}">Adjust Price</button>
      <button id="tcg-mode-match"  style="border-left:1px solid #555;${segStyle(savedMode === "match")}">Match Market</button>
    </div>

    <div id="tcg-adjust-section" style="display:${savedMode === "adjust" ? "grid" : "none"};grid-template-columns:auto 1fr;gap:8px 10px;align-items:center;margin-bottom:16px;">
      <span style="font-size:12px;color:#aaa;white-space:nowrap;">Floor price ($)</span>
      <input id="tcg-floor-input" type="number" min="0" step="0.01" value="${savedFloor}"
        style="padding:8px;border:1px solid #555;border-radius:4px;background:#16213e;color:#e0e0e0;font-size:15px;outline:none;width:100%;box-sizing:border-box;" />
      <span style="font-size:12px;color:#aaa;white-space:nowrap;">% above market</span>
      <input id="tcg-percent-input" type="number" step="0.1" value="${savedPercent}"
        style="padding:8px;border:1px solid #555;border-radius:4px;background:#16213e;color:#e0e0e0;font-size:15px;outline:none;width:100%;box-sizing:border-box;" />
</div>

    <div id="tcg-match-section" style="display:${savedMode === "match" ? "block" : "none"};margin-bottom:16px;font-size:13px;color:#aaa;">
      Prices will be set exactly to market price with no adjustment.
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

  let activeMode = savedMode;

  const modeBtns = {
    adjust: box.querySelector("#tcg-mode-adjust"),
    match:  box.querySelector("#tcg-mode-match"),
  };
  const sections = {
    adjust: box.querySelector("#tcg-adjust-section"),
    match:  box.querySelector("#tcg-match-section"),
  };

  function activateMode(mode) {
    activeMode = mode;
    for (const [key, btn] of Object.entries(modeBtns)) {
      const on = key === mode;
      btn.style.background = on ? "#4caf7d" : "transparent";
      btn.style.color      = on ? "#fff" : "#aaa";
      btn.style.fontWeight = on ? "bold" : "normal";
      sections[key].style.display = on ? (key === "adjust" ? "grid" : "block") : "none";
    }
    if (mode === "adjust") box.querySelector("#tcg-floor-input").focus();
  }

  for (const [mode, btn] of Object.entries(modeBtns)) {
    btn.addEventListener("click", () => activateMode(mode));
  }

  function close() { backdrop.remove(); }

  box.querySelector("#tcg-cancel-btn").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });

  box.querySelector("#tcg-save-btn").addEventListener("click", () => {
    if (activeMode === "adjust") {
      const floor = parseFloat(box.querySelector("#tcg-floor-input").value);
      const pct   = parseFloat(box.querySelector("#tcg-percent-input").value);
      if (isNaN(floor) || floor < 0) {
        box.querySelector("#tcg-floor-input").style.borderColor = "#e06060";
        return;
      }
      if (isNaN(pct)) {
        box.querySelector("#tcg-percent-input").style.borderColor = "#e06060";
        return;
      }
      localStorage.setItem(STORAGE_KEY_FLOOR, floor.toFixed(2));
      localStorage.setItem(STORAGE_KEY_PERCENT, pct.toString());
    }
    localStorage.setItem(STORAGE_KEY_MODE, activeMode);
    close();
  });

  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Enter")  box.querySelector("#tcg-save-btn").click();
    if (e.key === "Escape") close();
    if (e.key === "Enter" || e.key === "Escape") document.removeEventListener("keydown", onKey);
  });
}


function applyPricing() {
  const mode = localStorage.getItem(STORAGE_KEY_MODE) || "adjust";

  $('.product-listing__market-price span input').each(function() {
    $(this).click();
  });

  if (mode === "match") return;

  const floor = parseFloat(localStorage.getItem(STORAGE_KEY_FLOOR)   || "0.25");
  const pct   = parseFloat(localStorage.getItem(STORAGE_KEY_PERCENT) || "0");

  $(".validation-message-container")
    .find("input[aria-label='Marketplace price for undefined - undefined - undefined - undefined']")
    .each(function() {
      const current = parseFloat($(this).val());
      if (!isNaN(current)) {
        const newPrice = Math.max(floor, current * (1 + pct / 100));
        $(this).val(newPrice.toFixed(2)).trigger("input").trigger("change");
      }
    });
}
