// Official LEGO colours: the name a builder uses → LDraw code and display colour. Names are matched loosely
// ("Dark Bluish Gray", "dark-bluish-grey", "DarkBluishGray" are the same colour).
// Only colours LEGO actually produces in quantity are listed; a set should use few of them (see AGENTS.md, "Colour").
export const COLORS = {
  // neutrals
  'White': [15, '#F4F4F4'], 'Light Bluish Gray': [71, '#A0A5A9'], 'Dark Bluish Gray': [72, '#6C6E68'], 'Black': [0, '#1B2A34'],
  'Very Light Bluish Gray': [151, '#E6E3DA'],
  // earth
  'Tan': [19, '#E4CD9E'], 'Dark Tan': [28, '#958A73'], 'Reddish Brown': [70, '#582A12'], 'Dark Brown': [308, '#352100'], 'Medium Nougat': [84, '#AA7D55'],
  'Light Nougat': [78, '#F6D7B3'], 'Nougat': [92, '#D09168'], 'Dark Orange': [484, '#A95500'], 'Sand Green': [378, '#A0BCAC'], 'Sand Blue': [379, '#6074A1'],
  'Olive Green': [330, '#9B9A5A'], 'Medium Tan': [371, '#CCA373'],
  // reds, oranges, yellows
  'Red': [4, '#C91A09'], 'Dark Red': [320, '#720E0F'], 'Orange': [25, '#FE8A18'], 'Bright Light Orange': [191, '#F8BB3D'], 'Yellow': [14, '#F2CD37'],
  'Bright Light Yellow': [226, '#FFF03A'], 'Coral': [353, '#FF698F'], 'Salmon': [12, '#F2705E'],
  // greens
  'Green': [2, '#237841'], 'Bright Green': [10, '#4B9F4A'], 'Dark Green': [288, '#184632'], 'Lime': [27, '#BBE90B'], 'Yellowish Green': [326, '#DFEEA5'],
  'Light Aqua': [323, '#ADC3C0'], 'Dark Turquoise': [3, '#008F9B'],
  // blues, purples, pinks
  'Blue': [1, '#0055BF'], 'Dark Blue': [272, '#0A3463'], 'Medium Blue': [73, '#5A93DB'], 'Medium Azure': [322, '#36AEBF'], 'Dark Azure': [321, '#078BC9'],
  'Bright Light Blue': [212, '#9FC3E9'], 'Dark Purple': [85, '#3F3691'], 'Medium Lavender': [30, '#AC78BA'], 'Lavender': [31, '#E1D5ED'],
  'Magenta': [26, '#923978'], 'Dark Pink': [5, '#C870A0'], 'Bright Pink': [29, '#E4ADC8'],
  // metallic
  'Pearl Gold': [297, '#AA7F2E'], 'Flat Silver': [315, '#898788'], 'Pearl Dark Gray': [148, '#575857'],
  // transparent
  'Trans Clear': [47, '#FCFCFC', 0.45], 'Trans Light Blue': [43, '#AEEFEC', 0.55], 'Trans Dark Blue': [33, '#0020A0', 0.55], 'Trans Red': [36, '#C91A09', 0.6],
  'Trans Orange': [57, '#F08F1C', 0.6], 'Trans Yellow': [46, '#F5CD2F', 0.6], 'Trans Green': [34, '#237841', 0.6], 'Trans Bright Green': [35, '#56E646', 0.6],
  'Trans Black': [40, '#635F52', 0.6], 'Trans Pink': [45, '#FC97AC', 0.6], 'Trans Purple': [52, '#A5A5CB', 0.6], 'Trans Neon Green': [42, '#C0FF00', 0.6],
};
const norm = (s) => String(s).toLowerCase().replace(/grey/g, 'gray').replace(/[^a-z]/g, '');
const INDEX = new Map(); for (const [name, v] of Object.entries(COLORS)) INDEX.set(norm(name), name);
for (const [alias, name] of [['lbg', 'Light Bluish Gray'], ['dbg', 'Dark Bluish Gray'], ['lightgray', 'Light Bluish Gray'], ['darkgray', 'Dark Bluish Gray'], ['gray', 'Light Bluish Gray'],
  ['brown', 'Reddish Brown'], ['beige', 'Tan'], ['gold', 'Pearl Gold'], ['silver', 'Flat Silver'], ['glass', 'Trans Clear'], ['transparent', 'Trans Clear'], ['skin', 'Yellow'], ['navy', 'Dark Blue'], ['pink', 'Bright Pink'], ['purple', 'Dark Purple']])
  INDEX.set(alias, name);
/** canonical colour name, or null */
export function colorName(c) { return INDEX.get(norm(c)) ?? null; }
export function colorInfo(c) { const n = colorName(c); if (!n) return null; const [code, hex, alpha] = COLORS[n]; return { name: n, code, hex, alpha: alpha ?? 1 }; }
