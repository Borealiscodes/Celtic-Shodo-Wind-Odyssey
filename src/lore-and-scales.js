/**
 * src/lore-and-scales.js — Four Archipelago Shrines, Irish Ogham & Shodō Lessons, and Shared D-Yo Scale
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

// Shared Pentatonic Bridge: Irish D-Major/Dorian & Japanese Yo Scale (D4, E4, G4, A4, B4)
export const SHARED_D_YO_SCALE_HZ = [293.66, 329.63, 392.00, 440.00, 493.88];

export const ARCHIPELAGO_SHRINES = [
  {
    id: "bru-enso",
    name: "1. Isle of Brú & Ensō",
    glyphType: "CIRCLE",
    glyphIcon: "〇 / ꩜",
    x: 175,
    y: 135,
    brushPrompt: "Draw a Closed Circle (Ensō / Triskele Spiral)",
    folkUnlock: "Layer 1: Irish Low Whistle + Shakuhachi Flute",
    lesson:
      "Zen Ensō circles symbolize wholeness and emptiness in one breath, echoing Neolithic triple spirals carved at Brú na Bóinne (Newgrange, Co. Meath) over 5,000 years ago to mark cyclical time.",
  },
  {
    id: "ogham-kaze",
    name: "2. Ogham & Kaze Ridge",
    glyphType: "SLASH",
    glyphIcon: "ᚁ / 風",
    x: 505,
    y: 130,
    brushPrompt: "Draw a Straight Directional Slash (Ogham Beith / Kaze Wind)",
    folkUnlock: "Layer 2: Celtic Lever Harp + Japanese Koto Plucks",
    lesson:
      "Early medieval Irish Ogham stones carved tree-alphabet notches across a central vertical stemline (druim)—pairing with Japanese directional brushwork (yoko-kaku) to shift the Wind Waker sea breeze!",
  },
  {
    id: "seannos-kana",
    name: "3. Sean-Nós & Kana Shoals",
    glyphType: "WAVE",
    glyphIcon: "〰 / あ",
    x: 515,
    y: 345,
    brushPrompt: "Draw a Flowing S-Curve Wave (Mizu / Onnade Ribbon)",
    folkUnlock: "Layer 3: Bodhrán Frame Drum + Taiko Pulse",
    lesson:
      "Irish sean-nós ('old style') unaccompanied singing weaves fluid melodic ornaments much like Heian-period Hiragana (Onnade, 'women's hand') poetry scrolls—calming tidal reefs across the shoals.",
  },
  {
    id: "solstice-toro",
    name: "4. Solstice & Tōrō Beacon",
    glyphType: "CROSS",
    glyphIcon: "✦ / 灯",
    x: 175,
    y: 345,
    brushPrompt: "Draw Two Intersecting Strokes (Solstice Cross / Tōrō Lantern)",
    folkUnlock: "Layer 4: Uilleann Drone + Bonshō Temple Bell",
    lesson:
      "Newgrange's winter-solstice roofbox aligns a single beam of dawn light into its stone chamber, harmonizing with coastal Japanese stone tōrō lanterns that guide night sailors safely home.",
  },
];
