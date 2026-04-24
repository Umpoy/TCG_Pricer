# TCG Pricer

A Chrome extension for TCGPlayer sellers that matches all your listings to the current market price in a single click — no manual edits, no spreadsheets.

## How it works

Open your TCGPlayer admin pricing page and hit **⇄ Match Prices**. The extension activates each listing's market price input and syncs your asking price to match it. If a calculated market price falls below your floor, the floor is used instead — so you're always competitive without selling below your minimum. Changes register exactly as if you'd typed them by hand.

## Features

- **One-click market price matching** — syncs all listings to the current market price instantly
- **Floor price protection** — listings never drop below your saved minimum
- **Persistent settings** — your floor price is saved locally and ready every time you open the page

## Usage

1. Navigate to your TCGPlayer admin pricing page (`store.tcgplayer.com/admin/pricing*`)
2. Two buttons appear in the bottom-right corner:
   - **⇄ Match Prices** — matches all listings to market price (respecting your floor) in one click
   - **⚙** — opens Settings to update and save your floor price

## Installation

1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder
5. Reload any open TCGPlayer pricing tabs

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config and content script registration |
| `content.js` | Button UI, settings modal, and price-matching logic |
| `popup.html/js/css` | Card lookup popup (separate feature) |
