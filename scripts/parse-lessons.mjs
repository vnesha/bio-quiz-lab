import fs from 'node:fs';

const [,, inPath, grade] = process.argv;
if (!inPath || !grade) {
  console.error('Usage: node scripts/parse-lessons.mjs curriculum/grade-6-outline.txt 6');
  process.exit(1);
}

const txt = fs.readFileSync(inPath, 'utf8');
const lines = txt.split(/\n+/).map(l => l.trim()).filter(Boolean);

function norm(s){
  return s
    .replace(/[“”„]/g,'"')
    .replace(/[’‘]/g,"'")
    .replace(/\s+/g,' ')
    .replace(/\u00ad/g,'')
    .trim();
}

function looksLikeHeading(l){
  if (l.length < 4 || l.length > 120) return false;
  if (/^--- PAGE/i.test(l)) return false;
  if (/^БИОЛОГИЈА|^BIOLOGIJA/i.test(l)) return false;
  if (/ISBN|CIP|Каталогизација|Издавач|Редакција|Аутор|Рецензент/i.test(l)) return false;
  if (/^\d+\s*$/.test(l)) return false;
  // numbered headings
  if (/^(\d{1,2}[\).:-])\s+\S+/.test(l)) return true;
  // roman numerals
  if (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)[\).:-]\s+\S+/.test(l)) return true;
  // all caps-ish (serbian cyr/lat) with spaces
  const letters = (l.match(/[A-Za-zА-Яа-яČĆŠĐŽčćšđž]/g) || []).length;
  const uppers = (l.match(/[A-ZА-ЯČĆŠĐŽ]/g) || []).length;
  if (letters >= 12 && uppers/letters > 0.75 && l.includes(' ')) return true;
  // contains key biology words
  if (/(ćelij|tkiv|organ|sistem|biljk|životinj|čovek|ekolog|genet|evoluc|fotosintez|disanj|varenj|cirkulacij|nervn|skelet|mišić|reprodukc|razmnož|mikroorgan|bakterij|virus|gljiv|parazit|ekosistem)/i.test(l)) {
    return true;
  }
  return false;
}

// collect candidates
const candidates = [];
for (const raw of lines) {
  const l = norm(raw);
  if (!looksLikeHeading(l)) continue;
  // strip leading numbering
  const cleaned = l.replace(/^\s*(\d{1,2})[\).:-]\s*/,'').replace(/^\s*(I|II|III|IV|V|VI|VII|VIII|IX|X)[\).:-]\s*/,'');
  const c = norm(cleaned);
  if (c.length < 4) continue;
  candidates.push(c);
}

// de-dup (case-insensitive)
const seen = new Set();
const lessons = [];
for (const c of candidates) {
  const key = c.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  lessons.push(c);
}

// light filtering: remove extremely generic UI words
const filtered = lessons.filter(l => !/^(test|pitanja|zadatak|projekat|vežba|podsetnik)$/i.test(l));

const out = {
  grade: Number(grade),
  source: inPath,
  extractedAt: new Date().toISOString(),
  count: filtered.length,
  lessons: filtered
};

const outPath = `curriculum/grade-${grade}-lessons.json`;
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath, 'lessons:', filtered.length);
