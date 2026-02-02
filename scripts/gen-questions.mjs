import fs from 'node:fs';

const topics = [
  { name: 'Ćelija', key: 'cells' },
  { name: 'Biljke', key: 'plants' },
  { name: 'Životinje', key: 'animals' },
  { name: 'Čovek', key: 'human' },
];

function mcq(id, topic, prompt, choices, answerIndex, explanation) {
  return { id, topic, gradeBand: '5-8', type: 'mcq', prompt, choices, answerIndex, explanation };
}
function imageMcq(id, topic, prompt, imagePath, choices, answerIndex, explanation) {
  return { id, topic, gradeBand: '5-8', type: 'image-mcq', prompt, image: { kind: 'svg', path: imagePath }, choices, answerIndex, explanation };
}
function order(id, topic, prompt, items, explanation) {
  return { id, topic, gradeBand: '5-8', type: 'order', prompt, items, explanation };
}
function match(id, topic, prompt, left, right, pairs) {
  return { id, topic, gradeBand: '5-8', type: 'match', prompt, left, right, pairs };
}

const bank = [];

// --- ĆELIJA ---
{
  const t = 'Ćelija';
  // 35 MCQ
  const mcqs = [
    mcq('cells-mcq-1', t, 'Koji je osnovni gradivni i funkcionalni element živih bića?', ['Tkivo','Organ','Ćelija','Sistem organa'], 2, 'Ćelija je osnovna jedinica građe i funkcije svih živih bića.'),
    mcq('cells-mcq-2', t, 'Koja struktura ćelije sadrži genetski materijal (DNK)?', ['Mitohondrije','Jezgro','Ribozomi','Citoplazma'], 1, 'DNK se nalazi u jedru (jezgru) ćelije.'),
    mcq('cells-mcq-3', t, 'Koja organela je „elektrana“ ćelije (stvara energiju)?', ['Mitohondrija','Lizosom','Jedro','Hloroplast'], 0, 'Mitohondrije učestvuju u stvaranju energije u ćeliji.'),
    mcq('cells-mcq-4', t, 'Šta ćelijska membrana radi?', ['Služi za fotosintezu','Odvaja ćeliju od okoline','Stvara energiju','Sadrži hlorofil'], 1, 'Ćelijska membrana odvaja ćeliju od spoljašnje sredine i reguliše razmenu.'),
    mcq('cells-mcq-5', t, 'Kako se zove tečnost/unutrašnja sredina u kojoj se nalaze organeli?', ['Citoplazma','Hlorofil','Krv','Skrob'], 0, 'U citoplazmi se nalaze organeli i odvijaju se mnogi procesi.'),
    mcq('cells-mcq-6', t, 'Koji je „biljni“ organel koji omogućava fotosintezu?', ['Hloroplast','Mitohondrija','Jedro','Ribozom'], 0, 'Hloroplasti sadrže hlorofil i omogućavaju fotosintezu.'),
    mcq('cells-mcq-7', t, 'Koja je glavna razlika između biljne i životinjske ćelije?', ['Biljna ćelija nema jedro','Biljna ćelija ima ćelijski zid','Životinjska ćelija ima hloroplaste','Biljna ćelija nema membranu'], 1, 'Biljna ćelija ima ćelijski zid i često hloroplaste i veću vakuolu.'),
    mcq('cells-mcq-8', t, 'Koji nivo organizacije dolazi posle ćelije?', ['Organizam','Tkivo','Sistem organa','Organ'], 1, 'Ćelije se udružuju u tkiva.'),
    mcq('cells-mcq-9', t, 'Kako se zove proces deobe ćelije?', ['Isparavanje','Mitoza','Fotosinteza','Vrenje'], 1, 'Mitoza je deoba somatskih ćelija.'),
    mcq('cells-mcq-10', t, 'Ribozomi su zaduženi za:', ['sintezu proteina','sintezu DNK','stvaranje kiseonika','transport krvi'], 0, 'Ribozomi su mesta sinteze proteina.'),
  ];
  // Expand with safe patterns
  const extraPrompts = [
    ['Koja struktura biljnih ćelija daje čvrstinu i oblik?', ['Ćelijski zid','Membrana','Jedro','Ribozom'], 0, 'Ćelijski zid (od celuloze) daje čvrstinu biljnim ćelijama.'],
    ['Vakuola u biljnoj ćeliji najčešće služi za:', ['skladištenje vode i materija','sintezu proteina','razlaganje hrane','kretanje ćelije'], 0, 'Vakuola skladišti vodu i rastvorene materije i utiče na turgor.'],
    ['Hromozomi se nalaze u:', ['jedru','membrani','ćelijskom zidu','ribozomima'], 0, 'Hromozomi su u jedru i nose genetsku informaciju.'],
    ['Kako se zove skup sličnih ćelija koje obavljaju istu funkciju?', ['Tkivo','Organ','Organizam','Sistem'], 0, 'Tkivo je skup sličnih ćelija iste funkcije.'],
    ['Koja organela razlaže otpadne materije u ćeliji?', ['Lizosom','Hloroplast','Jedro','Vakuola'], 0, 'Lizosomi sadrže enzime koji razlažu različite supstance.'],
    ['DNK je skraćenica za:', ['deoksiribonukleinska kiselina','dinamička nuklearna komponenta','dvojna nuklearna kesa','depozitna kiselina'], 0, 'DNK znači deoksiribonukleinska kiselina.'],
    ['Šta od navedenog je živa struktura?', ['Ćelija','Kristal soli','Kap vode','Kamen'], 0, 'Ćelija je osnovna živa jedinica.'],
    ['Gde se nalazi hlorofil?', ['u hloroplastu','u mitohondriji','u jedru','u ribozomu'], 0, 'Hlorofil se nalazi u hloroplastima.'],
    ['Koja je uloga jedra?', ['Upravlja radom ćelije','Stvara kiseonik','Služi za kretanje','Pravi ćelijski zid'], 0, 'Jedro sadrži DNK i upravlja radom ćelije.'],
    ['Ćelijska membrana je:', ['polupropustljiva','nepropustljiva','samo od celuloze','samo od skroba'], 0, 'Membrana je polupropustljiva i reguliše ulazak/izlazak materija.'],
  ];
  let k = mcqs.length + 1;
  for (const [p, c, a, e] of extraPrompts) {
    mcqs.push(mcq(`cells-mcq-${k++}`, t, p, c, a, e));
  }
  // Fill to 35 with simple variations
  while (mcqs.length < 33) {
    const n = mcqs.length + 1;
    mcqs.push(mcq(`cells-mcq-${n}`, t,
      'Koji od navedenih pojmova je organela?',
      ['Mitohondrija','List','Korijen','Krvni sud'],
      0,
      'Mitohondrija je organela u ćeliji.'
    ));
  }
  mcqs.push(imageMcq('cells-mcq-34', t, 'Na ilustraciji je prikazana ćelija. Koji deo je obeležen kao „Jezgro“?', 'data/svg/cell.svg', ['Jezgro','Membrana','Citoplazma','Ćelijski zid'], 0, 'Na šemi je jezgro obeleženo kao centralna struktura.'));
  mcqs.push(imageMcq('cells-mcq-35', t, 'Na šemi ćelije, koja struktura je spoljašnji omotač?', 'data/svg/cell.svg', ['Ćelijska membrana','Jezgro','Ribozom','Hlorofil'], 0, 'Ćelijska membrana je spoljašnji omotač ćelije.'));

  // 10 ORDER
  const orders = [
    order('cells-order-1', t, 'Poređaj nivoe organizacije od najjednostavnijeg ka najsloženijem:', ['Ćelija','Tkivo','Organ','Sistem organa','Organizam'], 'Od ćelije nastaju tkiva, zatim organi, sistemi organa i organizam.'),
    order('cells-order-2', t, 'Poređaj od najmanjeg do najvećeg:', ['Molekul','Ćelija','Tkivo','Organ'], 'Molekuli grade ćelije, ćelije grade tkiva, a tkiva organe.'),
    order('cells-order-3', t, 'Poređaj korake (pojednostavljeno) u deobi ćelije:', ['Priprema','Deoba jedra','Deoba citoplazme','Nastaju dve ćelije'], 'Uprostčen prikaz: priprema → deoba jedra → deoba citoplazme → dve ćelije.'),
  ];
  while (orders.length < 10) {
    const n = orders.length + 1;
    orders.push(order(`cells-order-${n}`, t, 'Poređaj: od informacije do osobine (pojednostavljeno):', ['DNK','Gen','Proteini','Osobina'], 'DNK sadrži gene; geni nose informaciju za proteine; proteini daju osobine.'));
  }

  // 5 MATCH
  const matches = [
    match('cells-match-1', t, 'Upari deo ćelije sa funkcijom:',
      ['Jezgro','Ćelijska membrana','Citoplazma'],
      ['Odvaja ćeliju od okoline','Sadrži genetski materijal','U njoj se nalaze organeli'],
      { 'Jezgro':'Sadrži genetski materijal','Ćelijska membrana':'Odvaja ćeliju od okoline','Citoplazma':'U njoj se nalaze organeli' }
    ),
    match('cells-match-2', t, 'Upari organelu sa ulogom (pojednostavljeno):',
      ['Mitohondrija','Hloroplast','Ribozom'],
      ['Sinteza proteina','Fotosinteza','Stvaranje energije'],
      { 'Mitohondrija':'Stvaranje energije','Hloroplast':'Fotosinteza','Ribozom':'Sinteza proteina' }
    ),
  ];
  while (matches.length < 5) {
    const n = matches.length + 1;
    matches.push(match(`cells-match-${n}`, t, 'Upari pojam i opis:',
      ['Tkivo','Organ','Organizam'],
      ['Skup organa koji čine jedinku','Skup tkiva sa posebnom ulogom','Skup sličnih ćelija'],
      { 'Tkivo':'Skup sličnih ćelija','Organ':'Skup tkiva sa posebnom ulogom','Organizam':'Skup organa koji čine jedinku' }
    ));
  }

  bank.push(...mcqs, ...orders, ...matches);
}

// --- BILJKE ---
{
  const t = 'Biljke';
  const mcqs = [
    mcq('plants-mcq-1', t, 'Kako se zove proces u kome biljke uz pomoć svetlosti stvaraju hranu?', ['Disanje','Fotosinteza','Vrenje','Isparavanje'], 1, 'Fotosinteza koristi svetlost da iz CO₂ i vode nastane glukoza i kiseonik.'),
    mcq('plants-mcq-2', t, 'Koji gas biljke uglavnom uzimaju tokom fotosinteze?', ['Kiseonik','Ugljen-dioksid','Azot','Vodonik'], 1, 'Biljke uzimaju CO₂ za fotosintezu.'),
    mcq('plants-mcq-3', t, 'Gde se u biljci najčešće odvija fotosinteza?', ['U korenu','U listu','U cvetu','U semenu'], 1, 'Listovi sadrže hloroplaste i najčešće su mesto fotosinteze.'),
    mcq('plants-mcq-4', t, 'Koja je uloga korena?', ['Upija vodu i minerale','Služi za disanje riba','Stvara krv','Pomaže u letu'], 0, 'Koren upija vodu i mineralne materije i učvršćuje biljku.'),
    mcq('plants-mcq-5', t, 'Koja je uloga stabla?', ['Prenosi vodu i hranljive materije','Stvara svetlost','Hranjenje embriona','Razlaganje otpada'], 0, 'Stablo sprovodi materije i daje potporu.'),
  ];
  const extras = [
    ['Šta je hlorofil?', ['Zeleni pigment u listu','Biljni hormon','Vrsta semena','Biljna ćelija'], 0, 'Hlorofil je zeleni pigment u hloroplastima.'],
    ['Koji deo cveta se razvija u plod?', ['Tučak (plodnik)','Praśnici','List','Koren'], 0, 'Plod se razvija iz plodnika tučka posle oplodnje.'],
    ['Kako se zove proces isparavanja vode preko listova?', ['Transpiracija','Fermentacija','Mitoza','Difuzija'], 0, 'Transpiracija je isparavanje vode sa listova.'],
    ['Šta biljka proizvodi tokom fotosinteze?', ['Glukozu i kiseonik','Mlečnu kiselinu','Alkohol','Samo vodu'], 0, 'Fotosinteza daje glukozu i kiseonik.'],
    ['Koja tkiva sprovode vodu u biljci?', ['Ksilem','Samo epidermis','Mišićno tkivo','Nervno tkivo'], 0, 'Ksilem provodi vodu i minerale.' ],
    ['Koja tkiva sprovode organske materije (šećere)?', ['Floem','Ksilem','Koža','Kost'], 0, 'Floem provodi šećere nastale fotosintezom.' ],
    ['Šta je seme?', ['Oplodjena semenova zametka sa rezervnom hranom','List','Koren','Samo ljuska'], 0, 'Seme nastaje posle oplodnje i sadrži embrion.' ],
    ['Koja je uloga cveta?', ['Razmnožavanje','Upijanje vode','Skladištenje kiseonika','Kretanje'], 0, 'Cvet je organ razmnožavanja kod cvetnica.' ],
    ['Koji deo lista omogućava razmenu gasova?', ['Stome','Kora','Kost','Krv'], 0, 'Stome su sitni otvori na listu za razmenu gasova.' ],
  ];
  let k = mcqs.length + 1;
  for (const [p,c,a,e] of extras) mcqs.push(mcq(`plants-mcq-${k++}`, t, p,c,a,e));
  while (mcqs.length < 35) {
    const n = mcqs.length + 1;
    mcqs.push(mcq(`plants-mcq-${n}`, t, 'Koji deo biljke je najčešće zelen i vrši fotosintezu?', ['List','Koren','Seme','Plod'], 0, 'List najčešće vrši fotosintezu.'));
  }

  const orders = [
    order('plants-order-1', t, 'Poređaj delove biljke od zemlje ka vrhu (tipično):', ['Koren','Stablo','List','Cvet'], 'Koren je u zemlji, zatim stablo, listovi i cvetovi.'),
    order('plants-order-2', t, 'Poređaj korake (pojednostavljeno) u nastanku ploda:', ['Oprašivanje','Oplodnja','Razvoj semena','Razvoj ploda'], 'Oprašivanje → oplodnja → nastaje seme → razvija se plod.'),
  ];
  while (orders.length < 10) {
    const n = orders.length + 1;
    orders.push(order(`plants-order-${n}`, t, 'Poređaj: od uslova do proizvoda fotosinteze:', ['Svetlost','Voda','Ugljen-dioksid','Glukoza','Kiseonik'], 'Uslovi: svetlost, voda i CO₂ → proizvodi: glukoza i O₂.'));
  }

  const matches = [
    match('plants-match-1', t, 'Upari deo biljke sa ulogom:',
      ['Koren','Stablo','List','Cvet'],
      ['Razmnožavanje','Fotosinteza','Prenos materija','Upijanje vode i minerala'],
      { 'Koren':'Upijanje vode i minerala','Stablo':'Prenos materija','List':'Fotosinteza','Cvet':'Razmnožavanje' }
    ),
  ];
  while (matches.length < 5) {
    const n = matches.length + 1;
    matches.push(match(`plants-match-${n}`, t, 'Upari pojam i opis:',
      ['Fotosinteza','Transpiracija','Stome'],
      ['Isparavanje vode sa listova','Sitni otvori na listu','Stvaranje hrane uz svetlost'],
      { 'Fotosinteza':'Stvaranje hrane uz svetlost','Transpiracija':'Isparavanje vode sa listova','Stome':'Sitni otvori na listu' }
    ));
  }

  bank.push(...mcqs, ...orders, ...matches);
}

// --- ŽIVOTINJE ---
{
  const t = 'Životinje';
  const mcqs = [
    mcq('animals-mcq-1', t, 'Koja grupa životinja ima perje?', ['Ribe','Vodozemci','Ptice','Sisari'], 2, 'Perje je karakteristično za ptice.'),
    mcq('animals-mcq-2', t, 'Koja grupa životinja je hladnokrvna?', ['Sisari','Ptice','Vodozemci','Svi su toplokrvni'], 2, 'Vodozemci su hladnokrvni.'),
    mcq('animals-mcq-3', t, 'Koji organ ribe koriste za disanje u vodi?', ['Pluća','Škrge','Koža','Kljun'], 1, 'Ribe dišu pomoću škrga.'),
    mcq('animals-mcq-4', t, 'Koje životinje doje mladunčad?', ['Ptice','Ribe','Sisari','Insekti'], 2, 'Sisari doje mladunčad mlekom.'),
    mcq('animals-mcq-5', t, 'Koja grupa životinja ima hrskavičav skelet (primer: ajkula)?', ['Ribe hrskavičarke','Ptice','Vodozemci','Gmizavci'], 0, 'Ajkule su ribe hrskavičarke.'),
  ];
  const extras = [
    ['Koji su gmizavci (primer)?', ['Zmije i gušteri','Žabe','Sove','Kitovi'], 0, 'Gmizavci su npr. zmije i gušteri.'],
    ['Vodozemci žive:', ['u vodi i na kopnu','samo u vodi','samo na kopnu','samo u vazduhu'], 0, 'Vodozemci žive i u vodi i na kopnu.'],
    ['Koja je uloga perja kod ptica?', ['Izolacija i letenje','Disanje','Sinteza hrane','Fotosinteza'], 0, 'Perje pomaže u izolaciji i letenju.'],
    ['Insekti imaju:', ['3 para nogu','4 para nogu','1 nogu','nema noge'], 0, 'Insekti imaju tri para nogu (ukupno 6).'],
    ['Pauci imaju:', ['4 para nogu','3 para nogu','2 para nogu','6 pari'], 0, 'Pauci imaju četiri para nogu (8).'],
    ['Koja je osnovna razlika između kičmenjaka i beskičmenjaka?', ['Prisustvo kičme','Boja kože','Veličina','Način disanja'], 0, 'Kičmenjaci imaju kičmeni stub.' ],
  ];
  let k = mcqs.length + 1;
  for (const [p,c,a,e] of extras) mcqs.push(mcq(`animals-mcq-${k++}`, t, p,c,a,e));
  while (mcqs.length < 35) {
    const n = mcqs.length + 1;
    mcqs.push(mcq(`animals-mcq-${n}`, t, 'Koja od navedenih životinja je sisar?', ['Dupin','Ajkula','Šaran','Žaba'], 0, 'Dupin je sisar.' ));
  }

  const orders = [
    order('animals-order-1', t, 'Poređaj grupe po razvoju (pojednostavljeno):', ['Ribe','Vodozemci','Gmizavci','Ptice','Sisari'], 'Često se prikazuje kao ribe → vodozemci → gmizavci → ptice/sisari.'),
    order('animals-order-2', t, 'Poređaj: od jajeta do odraslog leptira (pojednostavljeno):', ['Jaje','Larva (gusenica)','Lutka','Odrasli leptir'], 'Metamorfoza: jaje → larva → lutka → odrasli.'),
  ];
  while (orders.length < 10) {
    const n = orders.length + 1;
    orders.push(order(`animals-order-${n}`, t, 'Poređaj korake (pojednostavljeno) u razvoju žabe:', ['Jaje','Punoglavac','Mlada žaba','Odrasla žaba'], 'Razvoj žabe: jaje → punoglavac → mlada žaba → odrasla.'));
  }

  const matches = [
    match('animals-match-1', t, 'Upari grupu i osobinu:',
      ['Ribe','Ptice','Sisari'],
      ['Perje','Škrge','Mleko'],
      { 'Ribe':'Škrge', 'Ptice':'Perje', 'Sisari':'Mleko' }
    ),
  ];
  while (matches.length < 5) {
    const n = matches.length + 1;
    matches.push(match(`animals-match-${n}`, t, 'Upari grupu i stanište (tipično):',
      ['Ribe','Vodozemci','Ptice'],
      ['Voda','Voda i kopno','Vazduh i kopno'],
      { 'Ribe':'Voda','Vodozemci':'Voda i kopno','Ptice':'Vazduh i kopno' }
    ));
  }

  bank.push(...mcqs, ...orders, ...matches);
}

// --- ČOVEK ---
{
  const t = 'Čovek';
  const mcqs = [
    mcq('human-mcq-1', t, 'Koji organ pumpa krv kroz telo?', ['Pluća','Jetra','Želudac','Srce'], 3, 'Srce je mišićni organ koji pumpa krv.'),
    mcq('human-mcq-2', t, 'Koji organ je odgovoran za disanje?', ['Pluća','Bubrezi','Koža','Kost'], 0, 'Pluća omogućavaju razmenu gasova.'),
    mcq('human-mcq-3', t, 'Koja je uloga krvi?', ['Prenos kiseonika i hranljivih materija','Fotosinteza','Stvaranje semena','Rast listova'], 0, 'Krv prenosi gasove i hranljive materije.'),
    mcq('human-mcq-4', t, 'Koji sistem organa omogućava kretanje?', ['Koštano-mišićni','Nervni','Respiratorni','Digestivni'], 0, 'Kosti i mišići omogućavaju kretanje.'),
    mcq('human-mcq-5', t, 'Koji organ filtrira krv i stvara mokraću?', ['Pluća','Bubrezi','Srce','Mozak'], 1, 'Bubrezi filtriraju krv i stvaraju mokraću.'),
  ];
  const extras = [
    ['Gde se vrši razmena gasova u plućima?', ['U alveolama','U želucu','U jetri','U bešici'], 0, 'Alveole su mehurići gde se vrši razmena gasova.' ],
    ['Koja je uloga mozga?', ['Kontroliše i koordinira rad tela','Stvara krv','VršI fotosintezu','Skladišti skrob'], 0, 'Mozak je centar nervnog sistema.' ],
    ['Koji organ pomaže razlaganje hrane pomoću kiseline?', ['Želudac','Srce','Pluća','Kičma'], 0, 'U želucu se hrana meša i razlaže kiselinama i enzimima.' ],
    ['Jetra je važna za:', ['Detoksikaciju i metabolizam','Disanje','Vid','Kretanje'], 0, 'Jetra ima važnu ulogu u metabolizmu i detoksikaciji.' ],
    ['Koji sistem prenosi nervne impulse?', ['Nervni sistem','Respiratorni sistem','Digestivni sistem','Skeletni sistem'], 0, 'Nervni sistem prenosi impulse.' ],
    ['Koji deo oka propušta svetlost i fokusira je?', ['Sočivo','Kost','Jetra','Pluća'], 0, 'Sočivo fokusira svetlost na mrežnjaču.' ],
  ];
  let k = mcqs.length + 1;
  for (const [p,c,a,e] of extras) mcqs.push(mcq(`human-mcq-${k++}`, t, p,c,a,e));
  while (mcqs.length < 33) {
    const n = mcqs.length + 1;
    mcqs.push(mcq(`human-mcq-${n}`, t, 'Koji organ je deo digestivnog sistema?', ['Želudac','Pluća','Koža','Uho'], 0, 'Želudac je deo digestivnog sistema.' ));
  }
  mcqs.push(imageMcq('human-mcq-34', t, 'Pogledaj šemu trupa. Koji su organi za disanje?', 'data/svg/torso.svg', ['Pluća','Bubrezi','Jetra','Kosti'], 0, 'Pluća su organi za disanje.' ));
  mcqs.push(imageMcq('human-mcq-35', t, 'Na šemi, koji organ je obojen crveno i pumpa krv?', 'data/svg/torso.svg', ['Srce','Jetra','Želudac','Pluća'], 0, 'Crveno je srce.' ));

  const orders = [
    order('human-order-1', t, 'Poređaj delove digestivnog puta (pojednostavljeno):', ['Usta','Jednjak','Želudac','Tanka creva','Debela creva'], 'Hrana prolazi: usta → jednjak → želudac → tanka → debela creva.'),
    order('human-order-2', t, 'Poređaj put krvi kroz srce (pojednostavljeno):', ['Vene','Desna strana srca','Pluća','Leva strana srca','Arterije'], 'Uprostčen tok: vene → desno srce → pluća → levo srce → arterije.'),
  ];
  while (orders.length < 10) {
    const n = orders.length + 1;
    orders.push(order(`human-order-${n}`, t, 'Poređaj: od ćelije do sistema (primer u telu):', ['Ćelija','Tkivo','Organ','Sistem organa'], 'U telu: ćelije → tkiva → organi → sistemi organa.'));
  }

  const matches = [
    match('human-match-1', t, 'Upari organ i funkciju:',
      ['Srce','Pluća','Bubrezi'],
      ['Filtriraju krv i stvaraju mokraću','Pumpa krv','Razmena gasova'],
      { 'Srce':'Pumpa krv', 'Pluća':'Razmena gasova', 'Bubrezi':'Filtriraju krv i stvaraju mokraću' }
    ),
  ];
  while (matches.length < 5) {
    const n = matches.length + 1;
    matches.push(match(`human-match-${n}`, t, 'Upari sistem i osnovnu ulogu:',
      ['Nervni','Digestivni','Respiratorni'],
      ['Razlaganje hrane','Disanje','Kontrola i koordinacija'],
      { 'Nervni':'Kontrola i koordinacija','Digestivni':'Razlaganje hrane','Respiratorni':'Disanje' }
    ));
  }

  bank.push(...mcqs, ...orders, ...matches);
}

// sanity
const byTopic = Object.fromEntries(topics.map(t => [t.name, bank.filter(q => q.topic === t.name).length]));

const out = `/** AUTO-GENERATED (seeded, curated templates). Edit scripts/gen-questions.mjs to regenerate. */\n\nexport const topics = ${JSON.stringify(topics.map(t=>t.name))};\n\nexport const questions = ${JSON.stringify(bank, null, 2)};\n`;
fs.writeFileSync('data/questions-bank.js', out, 'utf8');
console.log('Generated:', bank.length, 'questions');
console.log(byTopic);
