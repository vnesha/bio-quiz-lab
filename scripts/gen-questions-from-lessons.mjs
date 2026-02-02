import fs from 'node:fs';

const gradeFiles = [
  'curriculum/grade-6-lessons.json',
  'curriculum/grade-7-lessons.json',
  'curriculum/grade-8-lessons.json'
];

function cyrToLat(input) {
  const map = {
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Ђ':'Đ','Е':'E','Ж':'Ž','З':'Z','И':'I','Ј':'J','К':'K','Л':'L','Љ':'Lj','М':'M','Н':'N','Њ':'Nj','О':'O','П':'P','Р':'R','С':'S','Т':'T','Ћ':'Ć','У':'U','Ф':'F','Х':'H','Ц':'C','Ч':'Č','Џ':'Dž','Ш':'Š',
    'а':'a','б':'b','в':'v','г':'g','д':'d','ђ':'đ','е':'e','ж':'ž','з':'z','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ћ':'ć','у':'u','ф':'f','х':'h','ц':'c','ч':'č','џ':'dž','ш':'š'
  };
  return input.split('').map(ch => map[ch] ?? ch).join('');
}

function pickTopic(lesson) {
  const s = lesson.toLowerCase();
  if (/(ćelij|tkiv|organel|mitohond|hloroplast|dnk|hromozom)/i.test(s)) return 'Ćelija';
  if (/(biljk|fotosintez|cvet|koren|list|stablo|seme|plod)/i.test(s)) return 'Biljke';
  if (/(životinj|sisari|ptice|ribe|gmizav|vodozem|insekt|beskičmen|kičmen)/i.test(s)) return 'Životinje';
  if (/(čovek|organizam|srce|pluća|želud|jetra|bubre|krv|nerv|mozak|skelet|mišić|čulo)/i.test(s)) return 'Čovek';
  if (/(ekolog|ekosistem|lanac ishrane|biom|populacij|zajednic)/i.test(s)) return 'Ekologija';
  return 'Opšte';
}

function mcq(id, grade, lesson, topic, prompt, choices, answerIndex, explanation) {
  return { id, grade, lesson, topic, type: 'mcq', prompt, choices, answerIndex, explanation };
}
function orderQ(id, grade, lesson, topic, prompt, items, explanation) {
  return { id, grade, lesson, topic, type: 'order', prompt, items, explanation };
}
function matchQ(id, grade, lesson, topic, prompt, left, right, pairs) {
  return { id, grade, lesson, topic, type: 'match', prompt, left, right, pairs };
}

function templatesFor(lesson) {
  const s = lesson.toLowerCase();
  // Very lightweight keyword→question templates. This is a FIRST PASS.
  if (/fotosintez/.test(s)) {
    return {
      mcq: [
        ['Šta je fotosinteza?', ['Proces stvaranja hrane uz svetlost', 'Razlaganje hrane u želucu', 'Kretanje biljke', 'Deoba ćelije'], 0,
         'Fotosinteza je proces u kome biljke uz svetlost stvaraju organsku hranu.'],
        ['Koji gas biljke uzimaju tokom fotosinteze?', ['Kiseonik', 'Ugljen-dioksid', 'Azot', 'Helijum'], 1,
         'Biljke uzimaju CO₂, a oslobađaju O₂.'],
        ['Gde se najčešće odvija fotosinteza?', ['U korenu', 'U listu', 'U semenu', 'U zemljištu'], 1,
         'Listovi sadrže hloroplaste i najčešće su mesto fotosinteze.'],
      ],
      order: [
        ['Poređaj uslove i proizvode fotosinteze:', ['Svetlost', 'Voda', 'Ugljen-dioksid', 'Glukoza', 'Kiseonik'],
         'Uslovi: svetlost, voda i CO₂ → proizvodi: glukoza i O₂.']
      ],
      match: [
        ['Upari pojam i opis:', ['Hlorofil', 'Hloroplast', 'Fotosinteza'],
         ['Zeleni pigment', 'Organel u biljnoj ćeliji', 'Proces stvaranja hrane uz svetlost'],
         { 'Hlorofil':'Zeleni pigment', 'Hloroplast':'Organel u biljnoj ćeliji', 'Fotosinteza':'Proces stvaranja hrane uz svetlost' }]
      ]
    };
  }

  if (/ekosistem|ekolog|lanac|mreža ishrane|populacij|zajednic/.test(s)) {
    return {
      mcq: [
        ['Šta je ekosistem?', ['Zajednica živih bića i nežive sredine', 'Samo skup biljaka', 'Samo skup životinja', 'Jedna ćelija'], 0,
         'Ekosistem čine živa bića (biocenoza) i neživa sredina (biotop).'],
        ['Proizvođači u lancu ishrane su najčešće:', ['Biljke', 'Predatori', 'Paraziti', 'Razlagači'], 0,
         'Biljke su proizvođači jer stvaraju organsku materiju fotosintezom.'],
        ['Razlagači (dekompozitori) su najčešće:', ['Gljive i bakterije', 'Ptice', 'Ribe', 'Sisari'], 0,
         'Gljive i bakterije razlažu mrtvu organsku materiju.'],
      ],
      order: [
        ['Poređaj nivoe u jednostavnom lancu ishrane:', ['Proizvođač', 'Biljojed', 'Mesojed', 'Razlagači'],
         'Jednostavan lanac: proizvođač → biljojed → mesojed → razlagači.']
      ],
      match: [
        ['Upari ulogu i primer:', ['Proizvođač', 'Potrošač', 'Razlagač'],
         ['Zec', 'Gljive', 'Trava'],
         { 'Proizvođač':'Trava', 'Potrošač':'Zec', 'Razlagač':'Gljive' }]
      ]
    };
  }

  if (/srce|krv|cirkulacij/.test(s)) {
    return {
      mcq: [
        ['Koja je uloga srca?', ['Pumpa krv kroz telo', 'VršI fotosintezu', 'Stvara mokraću', 'Razlaže hranu'], 0,
         'Srce pumpa krv kroz krvne sudove.'],
        ['Krvni sudovi koji odvode krv od srca su:', ['Arterije', 'Vene', 'Kapilari', 'Alveole'], 0,
         'Arterije odvode krv od srca, vene vraćaju ka srcu.'],
      ],
      order: [
        ['Poređaj tok krvi (pojednostavljeno):', ['Srce', 'Arterije', 'Kapilari', 'Vene', 'Srce'],
         'Krv ide: srce → arterije → kapilari → vene → srce.']
      ],
      match: [
        ['Upari krvni sud i opis:', ['Arterije', 'Vene', 'Kapilari'],
         ['Vraćaju krv ka srcu', 'Razmena materija', 'Odvode krv od srca'],
         { 'Arterije':'Odvode krv od srca', 'Vene':'Vraćaju krv ka srcu', 'Kapilari':'Razmena materija' }]
      ]
    };
  }

  // Default templates
  return {
    mcq: [
      [`${lesson}: Koja tvrdnja je najtačnija?`, ['Ovo je lekcija iz biologije', 'Ovo je lekcija iz matematike', 'Ovo je istorija', 'Ovo je muzičko'], 0,
       'Lekcija je iz biologije.'],
      [`${lesson}: Koji pojam je najbliži biologiji?`, ['Ćelija', 'Integrali', 'Bitka', 'Akord'], 0,
       'Ćelija je osnovna biološka jedinica.'],
    ],
    order: [
      [`${lesson}: Poređaj od opšteg ka konkretnom (pojednostavljeno):`, ['Nauka', 'Biologija', 'Lekcija', 'Pojam'],
       'Opšte → konkretno.']
    ],
    match: [
      [`${lesson}: Upari pojam i oblast:`, ['Ćelija', 'List', 'Srce'],
       ['Biljke', 'Čovek', 'Ćelija'],
       { 'Ćelija':'Ćelija', 'List':'Biljke', 'Srce':'Čovek' }]
    ]
  };
}

function expandToCount(arr, count, make) {
  const out = [...arr];
  let i = 0;
  while (out.length < count) {
    out.push(make(i++));
  }
  return out;
}

const all = [];
let qid = 1;

for (const file of gradeFiles) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const grade = data.grade;

  for (const lessonRaw of data.lessons) {
    const lesson = cyrToLat(lessonRaw);
    const topic = pickTopic(lesson);
    const t = templatesFor(lesson);

    // Target per lesson: 8 mcq + 2 order + 1 match (first pass). Scale later.
    const mcqs = expandToCount(t.mcq, 8, (i) => [`${lesson}: Pitanje #${i+1}`, ['Tačno', 'Netačno', 'Ne znam', 'Preskoči'], 0, 'Prvo izdanje pitanja (auto).']);
    const orders = expandToCount(t.order, 2, (i) => [`${lesson}: Poređaj (primer #${i+1})`, ['1','2','3','4'], 'Primer ređanja.']);
    const matches = expandToCount(t.match, 1, (i) => [`${lesson}: Upari (primer #${i+1})`, ['A','B','C'], ['1','2','3'], { A:'1', B:'2', C:'3' }]);

    for (let i = 0; i < mcqs.length; i++) {
      const [prompt, choices, answerIndex, explanation] = mcqs[i];
      all.push(mcq(`g${grade}-q${qid++}`, grade, lesson, topic, prompt, choices, answerIndex, explanation));
    }
    for (let i = 0; i < orders.length; i++) {
      const [prompt, items, explanation] = orders[i];
      all.push(orderQ(`g${grade}-q${qid++}`, grade, lesson, topic, prompt, items, explanation));
    }
    for (let i = 0; i < matches.length; i++) {
      const [prompt, left, right, pairs] = matches[i];
      all.push(matchQ(`g${grade}-q${qid++}`, grade, lesson, topic, prompt, left, right, pairs));
    }
  }
}

const out = `/** AUTO-GENERATED from OCR lesson outlines. */\n\nexport const topics = ${JSON.stringify(['Sve','6. razred','7. razred','8. razred','Ćelija','Biljke','Životinje','Čovek','Ekologija','Opšte'], null, 2)};\n\nexport const questions = ${JSON.stringify(all, null, 2)};\n`;
fs.writeFileSync('data/questions-from-lessons.js', out, 'utf8');
console.log('Generated questions:', all.length);
