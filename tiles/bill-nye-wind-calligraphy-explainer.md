# 🟧 Bill Nye Tile: Celtic Shodō Wind Odyssey (How Vector Math Steers Sailboats & Recognizes Runes!)

**Altitude:** `A7` (Public-Facing Clarity Layer • Zero Jargon • Non-Activating)  
**Companion Runtime:** `Celtic-Shodo-Wind-Odyssey v1.0.0` (`Q16.16` • `3/3` Tests Passing)  
**Companion Guide:** [`docs/celtic-ogham-and-japanese-folk-guide.md`](../docs/celtic-ogham-and-japanese-folk-guide.md)  
**Maintainer:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` · County Dublin, Ireland)  

---

## ⭐ Bill Nye Says…

> “Kids!  
> 
> Imagine sailing a tiny wooden boat across a bright blue ocean where **every turn of your rudder paints a glowing calligraphy ribbon on the waves**—and whenever you pull out a magic brush and draw a straight slash across the sky, **the wind itself shifts direction to push your sail**!  
> 
> Under the hood, **Celtic Shodō Wind Odyssey** uses clean 2D vector geometry and a shared 5-note musical scale (`D – E – G – A – B`) so Irish whistles and Japanese flutes can jam together while you explore four sacred islands!”

---

## ⛵ Part 1: How Sailing & Celestial Brush Geometry Work

1. **Wind-Assisted Vector Sailing (`stepVoyageFrame`):**  
   Your boat's motion combines two forces in `Q16.16` integer math: your steering input *plus* a gentle push from the prevailing ocean breeze (`cos(windAngle)` and `sin(windAngle)`). When you draw a **Directional Slash (`SLASH`)** in Celestial Brush mode, `Math.atan2(dy, dx)` measures the exact angle of your stroke and rotates the wind compass to match!
2. **Four-Shape Celestial Brush Classifier (`classifyCelestialGlyph`):**  
   Without any heavy neural networks, four lightweight geometric rules distinguish every gesture you draw on the parchment overlay:
   * **✦ Two-Stroke Cross (`CROSS`):** Checks if the midpoints of your last two strokes intersect within `55 pixels`.
   * **〇 Closed Circle (`CIRCLE`):** Checks if a single loop has balanced width/height, a small start-to-end gap, and a total path length close to $\pi \times \text{diameter}$.
   * **ᚁ Straight Slash (`SLASH`):** Compares the straight-line chord distance between start and end against total path length (`chord / pathLen >= 0.86`).
   * **〰 Flowing S-Wave (`WAVE`):** Detects curved, winding strokes whose path length is significantly longer than their straight-line chord (`0.45 <= chord / pathLen < 0.86`).
3. **Why the Music Never Clashes (`SHARED_D_YO_SCALE_HZ`):**  
   Irish traditional music and the Japanese *Yo* scale share the exact five notes **`D – E – G – A – B`**. Each awakened island shrine unlocks one more layer of the ensemble!

---

## 🎮 Part 2: Game Design Mechanics This Prototype Unlocks

* **Wind-Puzzle Archipelago Exploration (*Wind Waker* Style):** Place sea currents, whirlpools, and rocky straits between islands so players have to aim their **Ogham/Kaze Wind Slash** at specific angles to tack against headwinds.
* **Dual-Culture Rune & Kanji Spellcrafting:** Combine two gestures in sequence—such as drawing a **Wave (`Mizu`)** followed by a **Circle (`Ensō`)**—to calm stormy seas or raise sunken stone causeways.
* **Interactive Folk Jam Session:** Let players toggle individual instrument stems (*Low Whistle*, *Shakuhachi*, *Harp*, *Koto*, *Bodhrán*, *Taiko*, *Uilleann Drone*, *Bonshō Bell*) to compose their own hybrid Celtic–Japanese sea shanties.

---

## 🧭 Provenance & Non-Activation Footer

* **Status:** Verified Educational Tile (`v1.0.0` Archipelago Sailing & Folk Brush Studio • `3/3` Tests Passing)  
* **Non-Activation Clause:** Descriptive educational tile only; strictly non-activating.  
* **Signed-off-by:** `Borealis Serenity Hedling <chguard-sentinel@vaked.dev>`
