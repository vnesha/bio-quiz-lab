/**
 * Question types:
 * - mcq: multiple choice
 * - order: arrange items in correct order
 * - match: match left items to right items
 * - image-mcq: mcq with an illustration (SVG file)
 */

export const topics = ["Ćelija", "Biljke", "Životinje", "Čovek"];

export const questions = [
  // --- ĆELIJA (primeri svih tipova) ---
  {
    id: "cells-mcq-1",
    topic: "Ćelija",
    gradeBand: "5-8",
    type: "mcq",
    prompt: "Koji je osnovni gradivni i funkcionalni element živih bića?",
    choices: ["Tkivo", "Organ", "Ćelija", "Sistem organa"],
    answerIndex: 2,
    explanation: "Ćelija je osnovna jedinica građe i funkcije svih živih bića."
  },
  {
    id: "cells-order-1",
    topic: "Ćelija",
    gradeBand: "5-8",
    type: "order",
    prompt: "Poređaj nivoe organizacije od najjednostavnijeg ka najsloženijem:",
    items: ["Ćelija", "Tkivo", "Organ", "Sistem organa", "Organizam"],
    explanation: "Od ćelije nastaju tkiva, od tkiva organi, zatim sistemi organa, pa organizam."
  },
  {
    id: "cells-match-1",
    topic: "Ćelija",
    gradeBand: "5-8",
    type: "match",
    prompt: "Upari deo ćelije sa funkcijom:",
    left: ["Jezgro", "Ćelijska membrana", "Citoplazma"],
    right: ["Sadrži genetski materijal", "Odvaja ćeliju od okoline", "U njoj se nalaze organeli"],
    pairs: {
      "Jezgro": "Sadrži genetski materijal",
      "Ćelijska membrana": "Odvaja ćeliju od okoline",
      "Citoplazma": "U njoj se nalaze organeli"
    }
  },
  {
    id: "cells-image-1",
    topic: "Ćelija",
    gradeBand: "5-8",
    type: "image-mcq",
    prompt: "Pogledaj ilustraciju. Kako se zove struktura koja upravlja radom ćelije?",
    image: { kind: "svg", path: "data/svg/cell.svg" },
    choices: ["Jezgro", "Membrana", "Citoplazma", "Vakuola"],
    answerIndex: 0,
    explanation: "Jezgro sadrži genetski materijal i upravlja radom ćelije."
  },

  // --- BILJKE (primer) ---
  {
    id: "plants-mcq-1",
    topic: "Biljke",
    gradeBand: "5-8",
    type: "mcq",
    prompt: "Kako se zove proces u kome biljke uz pomoć svetlosti stvaraju hranu?",
    choices: ["Disanje", "Fotosinteza", "Vrenje", "Isparavanje"],
    answerIndex: 1,
    explanation: "Fotosinteza koristi svetlost da iz CO₂ i vode nastane glukoza (hrana) i kiseonik."
  },

  // --- ŽIVOTINJE ---
  {
    id: "animals-mcq-1",
    topic: "Životinje",
    gradeBand: "5-8",
    type: "mcq",
    prompt: "Koja grupa životinja ima perje?",
    choices: ["Ribe", "Vodozemci", "Ptice", "Sisari"],
    answerIndex: 2,
    explanation: "Perje je karakteristično za ptice."
  },

  // --- ČOVEK (sa SVG) ---
  {
    id: "human-image-1",
    topic: "Čovek",
    gradeBand: "5-8",
    type: "image-mcq",
    prompt: "Pogledaj šemu. Koji organ pumpa krv kroz telo?",
    image: { kind: "svg", path: "data/svg/torso.svg" },
    choices: ["Pluća", "Jetra", "Želudac", "Srce"],
    answerIndex: 3,
    explanation: "Srce je mišićni organ koji pumpa krv kroz krvne sudove."
  }
];
