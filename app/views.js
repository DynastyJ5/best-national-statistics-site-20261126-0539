// DataNusa views: hash router and one renderer per page. Every link in the
// nav and every control on a page works — charts re-draw from the same data
// when a control changes, tables sort and filter in place.

import {
  INDICATORS, POPULATION_SERIES, GDP_GROWTH_SERIES, INFLATION_SERIES,
  UNEMPLOYMENT_SERIES, POVERTY_SERIES, GDP_SECTORS, AGE_GROUPS,
  EMPLOYMENT_SECTORS, CPI_GROUPS, PROVINCES, TRADE, RELEASES, SOURCES, UPDATED,
} from './data.js';
import { barChart, lineChart, hbarChart, donutChart } from './charts.js';

const view = document.getElementById('view');

const NAV = [
  ['#/', 'Beranda'],
  ['#/economy', 'Ekonomi'],
  ['#/population', 'Penduduk'],
  ['#/labour', 'Tenaga Kerja'],
  ['#/prices', 'Harga'],
  ['#/regions', 'Daerah'],
  ['#/sources', 'Sumber Data'],
];

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function kpiCard(k) {
  return `<article class="kpi">
    <p class="kpi-label">${k.label}</p>
    <p class="kpi-value">${k.value}</p>
    <p class="kpi-sub">${k.sub}</p>
    <p class="kpi-delta ${k.good ? 'good' : ''}">${k.delta}</p>
    <p class="kpi-src">Sumber: ${k.source}, ${k.year}</p>
  </article>`;
}

function pageHead(title, intro, source) {
  return `<header class="page-head">
    <h1>${title}</h1>
    <p class="lede">${intro}</p>
    <p class="src-line">Sumber: ${source}</p>
  </header>`;
}

function chartCard(title, note, chartEl, controlsHtml = '') {
  const card = el(`<section class="card chart-card">
    <div class="card-head"><h2>${title}</h2>${controlsHtml}</div>
    <div class="chart"></div>
    <p class="note">${note}</p>
  </section>`);
  card.querySelector('.chart').appendChild(chartEl);
  return card;
}

function rangeControls(id, current) {
  const ranges = [['all', '2015–2024'], ['early', '2015–2019'], ['late', '2020–2024']];
  return `<div class="seg" role="group" aria-label="Rentang tahun" data-range-group="${id}">` +
    ranges.map(([v, l]) => `<button type="button" data-range="${v}" class="${v === current ? 'on' : ''}" aria-pressed="${v === current}">${l}</button>`).join('') +
    `</div>`;
}

function slice(series, range) {
  if (range === 'early') return series.filter((d) => d.year <= 2019);
  if (range === 'late') return series.filter((d) => d.year >= 2020);
  return series;
}

function bindRange(groupId, redraw) {
  view.querySelectorAll(`[data-range-group="${groupId}"] button`).forEach((b) => {
    b.addEventListener('click', () => {
      view.querySelectorAll(`[data-range-group="${groupId}"] button`).forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on');
      b.setAttribute('aria-pressed', 'true');
      redraw(b.dataset.range);
    });
  });
}

function renderHome() {
  view.innerHTML = '';
  const hero = el(`<section class="hero">
    <p class="eyebrow">Portal Statistik Nasional · Indonesia</p>
    <h1>Angka-angka Indonesia,<br>dalam satu tempat.</h1>
    <p class="lede">Penduduk, ekonomi, tenaga kerja, harga, dan daerah — angka resmi terbaru
    beserta sumber dan tahunnya, disajikan agar mudah ditemukan dan mudah dibaca.</p>
    <p class="hero-meta">Terakhir diperbarui ${UPDATED} · Semua angka dari ${SOURCES.bps} dan Bank Dunia</p>
    <div class="hero-links">
      <a class="btn" href="#/economy">Lihat ekonomi →</a>
      <a class="btn ghost" href="#/regions">Bandingkan provinsi →</a>
    </div>
  </section>`);
  view.appendChild(hero);

  const kpis = el('<section class="kpi-grid" aria-label="Indikator utama"></section>');
  INDICATORS.forEach((k) => kpis.appendChild(el(kpiCard(k))));
  view.appendChild(kpis);

  const grid = el('<div class="two-col"></div>');
  const popCard = chartCard(
    'Penduduk Indonesia, 2015–2024',
    'Juta jiwa, estimasi pertengahan tahun. Penduduk tumbuh rata-rata 0,9% per tahun; Jawa masih menampung 56% penduduk.',
    barChart(POPULATION_SERIES, { label: 'Population 2015 to 2024, millions', unit: 'jt' }),
    rangeControls('pop', 'all'),
  );
  grid.appendChild(popCard);
  const gdpCard = chartCard(
    'Pertumbuhan ekonomi, 2015–2024',
    'PDB riil, % per tahun. Kontraksi 2020 adalah dampak pandemi; sejak 2022 pertumbuhan kembali di atas 5%.',
    lineChart(GDP_GROWTH_SERIES, { label: 'Real GDP growth 2015 to 2024, percent', min: -3 }),
    rangeControls('gdp', 'all'),
  );
  grid.appendChild(gdpCard);
  view.appendChild(grid);
  bindRange('pop', (r) => {
    const c = popCard.querySelector('.chart');
    c.replaceChildren(barChart(slice(POPULATION_SERIES, r), { label: 'Population chart' }));
  });
  bindRange('gdp', (r) => {
    const c = gdpCard.querySelector('.chart');
    c.replaceChildren(lineChart(slice(GDP_GROWTH_SERIES, r), { label: 'GDP growth chart', min: -3 }));
  });

  const rel = el(`<section class="card">
    <div class="card-head"><h2>Rilis terbaru</h2><a href="#/sources">Semua sumber →</a></div>
    <ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${r.date}</span><span class="rel-tag">${r.tag}</span>${r.title}</li>`).join('')}</ul>
  </section>`);
  view.appendChild(rel);
}

function renderEconomy() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Ekonomi', 'PDB Rp22.139 triliun pada 2024 dengan pertumbuhan 5,03%. Manufaktur tetap penyumbang terbesar, diikuti perdagangan dan pertanian.', `${SOURCES.bps}, 2024`)));
  const grid = el('<div class="two-col"></div>');
  let sectorMode = 'share';
  const sectorCard = chartCard(
    'PDB menurut lapangan usaha, 2024',
    'Pangsa terhadap PDB nominal. Tiga lapangan usaha teratas — manufaktur, perdagangan, pertanian — menyumbang 44,5% PDB.',
    hbarChart(GDP_SECTORS, { label: 'GDP by sector 2024, percent share' }),
    `<div class="seg" role="group" aria-label="Tampilan sektor"><button type="button" data-mode="share" class="on">Pangsa %</button><button type="button" data-mode="rank">Peringkat</button></div>`,
  );
  grid.appendChild(sectorCard);
  const growthCard = chartCard(
    'Pertumbuhan PDB riil, 2015–2024',
    'Persen per tahun. Klik "Batang" untuk melihat angka tahunan sebagai batang.',
    lineChart(GDP_GROWTH_SERIES, { label: 'Real GDP growth', min: -3 }),
    `<div class="seg" role="group" aria-label="Jenis grafik"><button type="button" data-type="line" class="on">Garis</button><button type="button" data-type="bar">Batang</button></div>`,
  );
  grid.appendChild(growthCard);
  view.appendChild(grid);
  sectorCard.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    sectorCard.querySelectorAll('[data-mode]').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    sectorMode = b.dataset.mode;
    const c = sectorCard.querySelector('.chart');
    if (sectorMode === 'rank') {
      const ranked = [...GDP_SECTORS].sort((a, b) => b.share - a.share);
      c.replaceChildren(hbarChart(ranked, { label: 'GDP by sector ranked' }));
    } else {
      c.replaceChildren(hbarChart(GDP_SECTORS, { label: 'GDP by sector 2024' }));
    }
  }));
  growthCard.querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => {
    growthCard.querySelectorAll('[data-type]').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    const c = growthCard.querySelector('.chart');
    c.replaceChildren(b.dataset.type === 'bar'
      ? barChart(GDP_GROWTH_SERIES, { label: 'GDP growth bars', color: '#3d6b8e' })
      : lineChart(GDP_GROWTH_SERIES, { label: 'GDP growth line', min: -3 }));
  }));

  const trade = el(`<section class="card">
    <div class="card-head"><h2>Perdagangan luar negeri</h2><span class="src-line">BPS &amp; ${SOURCES.bi}</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tahun</th><th>Ekspor (US$ miliar)</th><th>Impor (US$ miliar)</th><th>Neraca (US$ miliar)</th></tr></thead>
    <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td>${t.exports.toFixed(1)}</td><td>${t.imports.toFixed(1)}</td><td class="${t.exports - t.imports >= 0 ? 'good' : 'bad'}">+${(t.exports - t.imports).toFixed(1)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Indonesia mencatat surplus perdagangan lima tahun berturut-turut; surplus 2024 sebesar US$31,0 miliar.</p>
  </section>`);
  view.appendChild(trade);
}

function renderPopulation() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Penduduk', '283,5 juta jiwa pada pertengahan 2024. Separuh lebih tinggal di Jawa; kelompok usia produktif (15–64 tahun) mencapai 69% penduduk.', `${SOURCES.bps} — Proyeksi Penduduk 2024`)));
  const grid = el('<div class="two-col"></div>');
  const ageCard = el(`<section class="card chart-card"><div class="card-head"><h2>Struktur umur, 2024</h2></div>
    <div class="donut-wrap"><div class="chart"></div>
    <ul class="legend">${AGE_GROUPS.map((a, i) => `<li><span class="sw" style="background:${['#0f766e', '#e8a33d', '#3d6b8e', '#b0483e', '#7a9e4f'][i]}"></span>${a.group} — <b>${a.share}%</b></li>`).join('')}</ul></div>
    <p class="note">Bonus demografi: rasio ketergantungan 44,9 — setiap 100 penduduk usia kerja menanggung 45 penduduk non-usia kerja.</p></section>`);
  ageCard.querySelector('.chart').appendChild(donutChart(AGE_GROUPS, { label: 'Age structure 2024', center: '69%', centerSub: 'usia 15–64 th' }));
  grid.appendChild(ageCard);
  const popCard = chartCard(
    'Pertumbuhan penduduk, 2015–2024',
    'Juta jiwa. Laju tumbuh melambat dari 1,3% (2015) menjadi 0,8% (2024).',
    barChart(POPULATION_SERIES, { label: 'Population 2015 to 2024' }),
    rangeControls('pop2', 'all'),
  );
  grid.appendChild(popCard);
  view.appendChild(grid);
  bindRange('pop2', (r) => {
    popCard.querySelector('.chart').replaceChildren(barChart(slice(POPULATION_SERIES, r), { label: 'Population chart' }));
  });

  const tableCard = el(`<section class="card">
    <div class="card-head"><h2>Provinsi terpadat</h2>
    <label class="search">Cari provinsi <input id="prov-search" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label></div>
    <div class="tbl-wrap"><table class="tbl" id="prov-table"><thead><tr>
      <th><button type="button" data-sort="name">Provinsi ↕</button></th>
      <th><button type="button" data-sort="pop">Penduduk (jt) ↕</button></th>
      <th><button type="button" data-sort="grdpPc">PDRB per kapita (Rp jt) ↕</button></th>
      <th><button type="button" data-sort="poverty">Kemiskinan (%) ↕</button></th>
    </tr></thead><tbody></tbody></table></div>
    <p class="note">Klik judul kolom untuk mengurutkan. Sumber: BPS, 2024.</p>
  </section>`);
  view.appendChild(tableCard);
  const tbody = tableCard.querySelector('tbody');
  let sortKey = 'pop', sortDir = -1, query = '';
  function drawProv() {
    const rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(query))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);
    tbody.innerHTML = rows.map((p) => `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.grdpPc.toFixed(1)}</td><td>${p.poverty.toFixed(2)}</td></tr>`).join('')
      || '<tr><td colspan="4">Tidak ada provinsi yang cocok.</td></tr>';
  }
  tableCard.querySelectorAll('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    if (sortKey === b.dataset.sort) sortDir *= -1; else { sortKey = b.dataset.sort; sortDir = -1; }
    drawProv();
  }));
  tableCard.querySelector('#prov-search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); drawProv(); });
  drawProv();
}

function renderLabour() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Tenaga Kerja', 'Angkatan kerja 152,1 juta orang pada Agustus 2024; tingkat partisipasi 70,6%. Pengangguran terbuka turun ke 4,91% — terendah sejak 2015.', `${SOURCES.bpsSakernas}, Agustus 2024`)));
  const grid = el('<div class="two-col"></div>');
  grid.appendChild(chartCard(
    'Tingkat pengangguran terbuka, 2015–2024',
    'Persen angkatan kerja. Lonjakan 2020 adalah dampak pandemi; pemulihan berlanjut empat tahun berturut-turut.',
    lineChart(UNEMPLOYMENT_SERIES, { label: 'Open unemployment rate 2015 to 2024', color: '#b0483e' }),
    rangeControls('unemp', 'all'),
  ));
  grid.appendChild(chartCard(
    'Pekerja menurut lapangan usaha, 2024',
    'Pangsa pekerja. Pertanian masih menyerap pekerja terbanyak, diikuti perdagangan dan jasa.',
    hbarChart(EMPLOYMENT_SECTORS, { label: 'Employment by sector 2024' }),
  ));
  view.appendChild(grid);
  bindRange('unemp', (r) => {
    const cards = view.querySelectorAll('.chart-card');
    cards[0].querySelector('.chart').replaceChildren(lineChart(slice(UNEMPLOYMENT_SERIES, r), { label: 'Unemployment chart', color: '#b0483e' }));
  });
  const facts = el(`<section class="card"><div class="card-head"><h2>Yang perlu diketahui</h2></div>
    <ul class="facts">
      <li><b>152,1 jt</b> angkatan kerja; <b>144,6 jt</b> bekerja, <b>7,5 jt</b> menganggur (Agustus 2024).</li>
      <li><b>59,2%</b> pekerja berada di sektor informal — turun dari 60,4% setahun sebelumnya.</li>
      <li>Upah minimum provinsi 2025 naik rata-rata <b>6,5%</b>; tertinggi di Jakarta (Rp5,4 jt/bulan).</li>
      <li>Pengangguran lulusan perguruan tinggi <b>5,2%</b>, di bawah lulusan SMA (7,6%).</li>
    </ul>
    <p class="note">Sumber: ${SOURCES.bpsSakernas}, Agustus 2024.</p></section>`);
  view.appendChild(facts);
}

function renderPrices() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Harga', 'Inflasi 1,57% pada Desember 2024 — di bawah sasaran 2,5% ± 1%. Perawatan pribadi mencatat kenaikan tertinggi di antara kelompok pengeluaran.', `${SOURCES.bps} — Indeks Harga Konsumen, Desember 2024`)));
  const grid = el('<div class="two-col"></div>');
  grid.appendChild(chartCard(
    'Inflasi tahunan (IHK), 2015–2024',
    'Persen, Desember terhadap Desember. Lonjakan 2022 mengikuti penyesuaian harga BBM bersubsidi.',
    lineChart(INFLATION_SERIES, { label: 'Annual CPI inflation 2015 to 2024', color: '#e8a33d' }),
    rangeControls('cpi', 'all'),
  ));
  grid.appendChild(chartCard(
    'Kemiskinan, 2015–2024',
    'Persen penduduk. Turun dari 11,22% menjadi 8,57% dalam sembilan tahun, dengan jeda naik saat pandemi.',
    lineChart(POVERTY_SERIES, { label: 'Poverty rate 2015 to 2024', color: '#0f766e' }),
    rangeControls('pov', 'all'),
  ));
  view.appendChild(grid);
  bindRange('cpi', (r) => {
    view.querySelectorAll('.chart-card')[0].querySelector('.chart').replaceChildren(lineChart(slice(INFLATION_SERIES, r), { label: 'Inflation chart', color: '#e8a33d' }));
  });
  bindRange('pov', (r) => {
    view.querySelectorAll('.chart-card')[1].querySelector('.chart').replaceChildren(lineChart(slice(POVERTY_SERIES, r), { label: 'Poverty chart' }));
  });
  const cpi = el(`<section class="card">
    <div class="card-head"><h2>Inflasi menurut kelompok pengeluaran, 2024</h2><span class="src-line">BPS, Desember 2024</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kelompok</th><th>Inflasi (% yoy)</th></tr></thead>
    <tbody>${[...CPI_GROUPS].sort((a, b) => b.value - a.value).map((g) => `<tr><td>${g.group}</td><td class="${g.value < 0 ? 'good' : ''}">${g.value.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Perawatan pribadi naik paling tinggi (6,18%), didorong harga emas perhiasan; informasi dan komunikasi justru deflasi (−0,34%).</p>
  </section>`);
  view.appendChild(cpi);
}

function renderRegions() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Daerah', 'Dua belas provinsi terbesar menampung 76% penduduk Indonesia. PDRB per kapita tertinggi ada di Jakarta (Rp315,3 jt) — enam kali rata-rata nasional.', `${SOURCES.bps}, 2024`)));
  const card = chartCard(
    'Penduduk 12 provinsi terbesar, 2024',
    'Juta jiwa. Jawa Barat, Jawa Timur, dan Jawa Tengah adalah tiga provinsi terpadat.',
    hbarChart(PROVINCES.map((p) => ({ sector: p.name, share: p.pop })), { label: 'Population by province 2024', suffix: ' jt', labelWidth: 130 }),
  );
  view.appendChild(card);
  const tableCard = el(`<section class="card">
    <div class="card-head"><h2>Perbandingan provinsi</h2><span class="src-line">BPS, 2024</span></div>
    <div class="tbl-wrap"><table class="tbl" id="reg-table"><thead><tr>
      <th><button type="button" data-sort="name">Provinsi ↕</button></th>
      <th><button type="button" data-sort="pop">Penduduk (jt) ↕</button></th>
      <th><button type="button" data-sort="grdpPc">PDRB per kapita (Rp jt) ↕</button></th>
      <th><button type="button" data-sort="poverty">Kemiskinan (%) ↕</button></th>
    </tr></thead><tbody></tbody></table></div>
    <p class="note">Klik judul kolom untuk mengurutkan. PDRB per kapita dihitung atas dasar harga berlaku.</p>
  </section>`);
  view.appendChild(tableCard);
  const tbody = tableCard.querySelector('tbody');
  let sortKey = 'grdpPc', sortDir = -1;
  function draw() {
    tbody.innerHTML = [...PROVINCES].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir)
      .map((p) => `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.grdpPc.toFixed(1)}</td><td>${p.poverty.toFixed(2)}</td></tr>`).join('');
  }
  tableCard.querySelectorAll('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    if (sortKey === b.dataset.sort) sortDir *= -1; else { sortKey = b.dataset.sort; sortDir = -1; }
    draw();
  }));
  draw();
}

function renderSources() {
  view.innerHTML = '';
  view.appendChild(el(pageHead('Sumber Data & Metodologi', 'Semua angka di situs ini berasal dari publikasi resmi. Angka dibulatkan untuk keterbacaan; nilai persisnya ada di publikasi sumber.', 'DataNusa — catatan metodologi')));
  const card = el(`<section class="card">
    <div class="card-head"><h2>Publikasi sumber</h2></div>
    <ul class="facts">
      <li><b>${SOURCES.bps}</b> — Berita Resmi Statistik: PDB, inflasi, kemiskinan, proyeksi penduduk, PDRB provinsi (2024).</li>
      <li><b>${SOURCES.bpsSakernas}</b> — Keadaan Angkatan Kerja di Indonesia, Agustus 2024: pengangguran, partisipasi, sektor pekerjaan.</li>
      <li><b>${SOURCES.bpsSusenas}</b> — Profil Kemiskinan di Indonesia, September 2024: garis dan tingkat kemiskinan.</li>
      <li><b>${SOURCES.bi}</b> — Neraca Pembayaran Indonesia 2024: ekspor, impor, neraca perdagangan.</li>
      <li><b>${SOURCES.wb}</b> — pembanding internasional: PDB per kapita dan harapan hidup.</li>
    </ul>
    <h3>Catatan</h3>
    <ul class="facts">
      <li>Angka 2024 adalah angka resmi terakhir yang diterbitkan saat situs ini diperbarui (${UPDATED}).</li>
      <li>PDB per kapita dalam dolar AS memakai kurs rata-rata tahun berjalan.</li>
      <li>Tingkat pengangguran memakai putaran Agustus Sakernas; tingkat kemiskinan memakai putaran September Susenas.</li>
      <li>Situs ini statis dan tidak mengambil data dari jaringan — semua angka tersimpan di berkas situs ini.</li>
    </ul>
    <p class="note">DataNusa adalah situs karya orisinal yang menyajikan ulang angka publik; situs ini bukan situs resmi ${SOURCES.bps}.</p>
  </section>`);
  view.appendChild(card);
}

const ROUTES = {
  '/': renderHome,
  '/economy': renderEconomy,
  '/population': renderPopulation,
  '/labour': renderLabour,
  '/prices': renderPrices,
  '/regions': renderRegions,
  '/sources': renderSources,
};

export function render() {
  const path = (window.location.hash || '#/').slice(1) || '/';
  const fn = ROUTES[path] ?? renderHome;
  fn();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${path}`);
    if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

export function navHtml() {
  return NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
}
