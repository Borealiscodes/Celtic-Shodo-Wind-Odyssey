> ✅ **RELEASE v1.0.0 — ARCHIPELAGO SAILING & CELESTIAL BRUSH STUDIO VERIFIED (`3/3` PASSING)**  
> *Zero-Float `Q16.16` • 4 Celestial Brush Glyphs • Shared `D – E – G – A – B` Irish–Japanese Folk Synth (Nov 2026)*

# ⛵ Celtic Shodō Wind Odyssey

An interactive, zero-dependency archipelago sailing and Celestial Brush puzzle game inspired by *The Legend of Zelda: The Wind Waker* and *Ōkami*—uniting fluid Japanese calligraphy (*Shodō* / 書道) and early Irish *Ogham* / Neolithic spiral carving with a procedural WebAudio synthesizer blending Irish folk music and Japanese traditional scales.

[![License: MIT](https://shields.io)](LICENSE)
[![Status: v1.0.0 Verified](https://shields.io)](#-quickstart--verification)
[![Math: Q16.16 Fixed-Point](https://shields.io)](#-core-gameplay--celestial-brush-mechanics)
[![Tests: 3/3 Passing](https://shields.io)](#-quickstart--verification)

---

## 📖 Companion Cultural & Technical Guides

* **Cultural & Musical Deep-Dive:** [`docs/celtic-ogham-and-japanese-folk-guide.md`](docs/celtic-ogham-and-japanese-folk-guide.md) — Explores Neolithic spirals at Brú na Bóinne (Newgrange), early medieval Irish *Ogham* tree stones, *sean-nós* vocal ornamentation, Japanese *Shodō* brushwork, and the shared `D – E – G – A – B` pentatonic bridge.
* **Plain-Language Explainer Tile:** [`tiles/bill-nye-wind-calligraphy-explainer.md`](tiles/bill-nye-wind-calligraphy-explainer.md) — Breaks down vector wind physics, gesture classification, and game mechanics in everyday terms.

---

## 🌊 Core Gameplay & Celestial Brush Mechanics

1. **Sailing & Calligraphy Wake:** Steer a sailboat across a cel-shaded sea chart using touch, cursor, or `WASD` keys, leaving a velocity-tapered ink-and-foam wake.
2. **Celestial Brush Mode (`Spacebar` / Mode Button):** Anchor at island shrines to paint geometric gestures on *washi* parchment:
   * **〇 Closed Circle (`CIRCLE`):** Single-breath loops (*Ensō* / *Triskele*).
   * **ᚁ Straight Directional Slash (`SLASH`):** Measures angle via `Math.atan2` to shift prevailing winds.
   * **〰 Flowing S-Curve Wave (`WAVE`):** Sinusoidal strokes (*Mizu* / *Onnade*).
   * **✦ Two-Stroke Cross (`CROSS`):** Intersecting strokes (*Solstice Light* / *Tōrō Lantern*).

---

## 🏝️ Four Sacred Archipelago Shrines

| # | Archipelago Shrine | Glyph & Gesture | Cultural & Historical Story | Folk Ensemble Layer Unlocked |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Isle of Brú & *Ensō*** | **〇 / ꩜** *(Circle)* | Zen *Ensō* circles paired with 5,000-year-old Neolithic triple spirals at **Brú na Bóinne (Newgrange)**. | **Layer 1:** Irish Low Whistle + Japanese *Shakuhachi* Flute |
| **2** | ***Ogham* & *Kaze* Ridge** | **ᚁ / 風** *(Slash)* | Irish **Ogham** tree-alphabet notches paired with Japanese directional wind brushwork (*yoko-kaku*). | **Layer 2:** Celtic Lever Harp + Japanese *Koto* arpeggios |
| **3** | ***Sean-Nós* & *Kana* Shoals** | **〰 / あ** *(Wave)* | Irish *sean-nós* ornamented vocals linked with Heian-period *Hiragana* (*Onnade*) poetry scrolls. | **Layer 3:** Irish *Bodhrán* Frame Drum + Japanese *Taiko* pulse |
| **4** | **Solstice & *Tōrō* Beacon** | **✦ / 灯** *(Cross)* | Newgrange winter-solstice light alignment paired with stone *tōrō* beacon lanterns. | **Layer 4:** Irish *Uilleann* `D3` Drone + Japanese *Bonshō* Bell |

---

## 🎶 The `D – E – G – A – B` Irish–Japanese Folk Musical Bridge

Irish traditional music (D-Major / D-Dorian pentatonic) and the Japanese *Yo* scale (*Yo-senpō*) share the pentatonic backbone **`D – E – G – A – B`** (`293.66` to `493.88 Hz`). This harmonious, dissonance-free tuning powers a mute-by-default WebAudio synthesizer blending Celtic whistles, harps, bodhráns, and uilleann drones with Japanese flutes, kotos, taiko drums, and temple bells.

---

## 📁 Repository Structure & Roadmap

The project features a clean zero-dependency ESM structure (`index.html`, `style.css`, `package.json`, `src/`, `docs/`, `tiles/`, and `test/`) developed across phases `v0.1` through `v1.0.0` (covering Q16.16 wind physics, the 4-layer folk synth, cel-shaded sea charts, and SHA-256 voyage receipts). For complete directory details, see the repository source files.

---

## 🚀 Quickstart & Verification

```bash
# 1. Run deterministic Celestial Brush, wind-shift & SHA-256 receipt tests (3/3 passing)
node --test test/wind-voyage-kernel.test.mjs

# 2. Launch locally in browser
python3 -m http.server 8080
```
Open **`http://localhost:8080`**, tap **`Sound: Muted`** to enable the folk ensemble, sail to the four shrines, and press `Spacebar` to paint Celestial Brush glyphs.

---

## 🤝 Provenance & License

Built with AI assistance in County Dublin, Ireland, by Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` • `chguard-sentinel@vaked.dev`), drawing upon architectural lineage from [`Borealiscodes/ndh-game-dev-kit`](https://github.com) and [`Borealiscodes/Okami-Shodo-Enso-Canvas`](https://github.com) under the **MIT License**.
