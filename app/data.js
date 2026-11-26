// DataNusa data: published national figures for Indonesia, rounded from
// Statistics Indonesia (BPS) and World Bank releases. Every series carries
// its source and reference year so a reader can check it. Values are
// mid-year estimates or annual figures as labelled; nothing here is live
// data — the site is a static snapshot, updated with each release.

export const SOURCES = {
  bps: 'Statistics Indonesia (BPS)',
  bpsSusenas: 'BPS — National Socio-Economic Survey (Susenas)',
  bpsSakernas: 'BPS — National Labour Force Survey (Sakernas)',
  wb: 'World Bank — World Development Indicators',
  bi: 'Bank Indonesia',
};

export const UPDATED = '26 November 2026';

// Headline indicators shown on the home page.
export const INDICATORS = [
  { id: 'pop', label: 'Population', value: '283.5 jt', sub: 'mid-2024 estimate', source: SOURCES.bps, year: 2024, delta: '+0.82% vs 2023', good: true },
  { id: 'gdp', label: 'GDP (nominal)', value: 'Rp22,139 T', sub: '≈ US$1,396 bn', source: SOURCES.bps, year: 2024, delta: '+5.03% real growth', good: true },
  { id: 'gdppc', label: 'GDP per capita', value: 'US$4,925', sub: 'Rp78.6 jt per person', source: SOURCES.bps, year: 2024, delta: '+4.1% vs 2023', good: true },
  { id: 'cpi', label: 'Inflation (CPI)', value: '1.57%', sub: 'year-on-year, Dec 2024', source: SOURCES.bps, year: 2024, delta: 'within 2.5% ± 1% target', good: true },
  { id: 'unemp', label: 'Unemployment', value: '4.91%', sub: 'open unemployment, Aug 2024', source: SOURCES.bpsSakernas, year: 2024, delta: '−0.41 pts vs Aug 2023', good: true },
  { id: 'poverty', label: 'Poverty rate', value: '8.57%', sub: '24.06 million people', source: SOURCES.bpsSusenas, year: 2024, delta: 'lowest since 1998', good: true },
  { id: 'hdi', label: 'Human Development Index', value: '75.02', sub: 'high human development', source: SOURCES.bps, year: 2024, delta: '+0.78 pts vs 2023', good: true },
  { id: 'life', label: 'Life expectancy', value: '73.6 th', sub: 'at birth', source: SOURCES.bps, year: 2024, delta: '+0.2 years vs 2023', good: true },
];

// Population, millions, mid-year estimates (BPS).
export const POPULATION_SERIES = [
  { year: 2015, value: 255.6 }, { year: 2016, value: 258.7 },
  { year: 2017, value: 261.9 }, { year: 2018, value: 265.0 },
  { year: 2019, value: 268.1 }, { year: 2020, value: 270.2 },
  { year: 2021, value: 272.7 }, { year: 2022, value: 275.8 },
  { year: 2023, value: 278.7 }, { year: 2024, value: 283.5 },
];

// Real GDP growth, % year-on-year (BPS).
export const GDP_GROWTH_SERIES = [
  { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 },
  { year: 2017, value: 5.07 }, { year: 2018, value: 5.17 },
  { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
  { year: 2021, value: 3.70 }, { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 }, { year: 2024, value: 5.03 },
];

// CPI inflation, % year-on-year, December (BPS).
export const INFLATION_SERIES = [
  { year: 2015, value: 3.35 }, { year: 2016, value: 3.02 },
  { year: 2017, value: 3.61 }, { year: 2018, value: 3.13 },
  { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 }, { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 }, { year: 2024, value: 1.57 },
];

// Open unemployment rate, % (BPS Sakernas, August round).
export const UNEMPLOYMENT_SERIES = [
  { year: 2015, value: 6.18 }, { year: 2016, value: 5.61 },
  { year: 2017, value: 5.50 }, { year: 2018, value: 5.34 },
  { year: 2019, value: 5.28 }, { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 }, { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 }, { year: 2024, value: 4.91 },
];

// Poverty rate, % of population (BPS Susenas, September round).
export const POVERTY_SERIES = [
  { year: 2015, value: 11.22 }, { year: 2016, value: 10.86 },
  { year: 2017, value: 10.64 }, { year: 2018, value: 9.82 },
  { year: 2019, value: 9.41 }, { year: 2020, value: 10.19 },
  { year: 2021, value: 9.71 }, { year: 2022, value: 9.57 },
  { year: 2023, value: 9.36 }, { year: 2024, value: 8.57 },
];

// GDP by sector, share of nominal GDP 2024, % (BPS).
export const GDP_SECTORS = [
  { sector: 'Manufacturing', share: 19.0 },
  { sector: 'Wholesale & retail trade', share: 13.0 },
  { sector: 'Agriculture, forestry & fishing', share: 12.5 },
  { sector: 'Construction', share: 9.8 },
  { sector: 'Mining & quarrying', share: 7.5 },
  { sector: 'Transport & storage', share: 4.4 },
  { sector: 'Information & communication', share: 4.4 },
  { sector: 'Financial & insurance', share: 4.2 },
  { sector: 'Real estate', share: 2.8 },
  { sector: 'Public administration', share: 2.6 },
  { sector: 'Other services', share: 19.8 },
];

// Population by age group, 2024, % (BPS projection).
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.4 },
  { group: '15–24 years', share: 16.6 },
  { group: '25–54 years', share: 42.5 },
  { group: '55–64 years', share: 9.7 },
  { group: '65+ years', share: 6.8 },
];

// Employment by sector, share of workers 2024, % (BPS Sakernas).
export const EMPLOYMENT_SECTORS = [
  { sector: 'Agriculture', share: 27.9 },
  { sector: 'Trade & retail', share: 19.2 },
  { sector: 'Manufacturing', share: 13.9 },
  { sector: 'Construction', share: 8.6 },
  { sector: 'Community & personal services', share: 16.4 },
  { sector: 'Transport & communication', share: 5.8 },
  { sector: 'Other', share: 8.2 },
];

// CPI by expenditure group, inflation 2024, % yoy (BPS).
export const CPI_GROUPS = [
  { group: 'Food, beverages & tobacco', value: 2.21 },
  { group: 'Clothing & footwear', value: 1.12 },
  { group: 'Housing, water, electricity & fuel', value: 0.57 },
  { group: 'Household equipment & maintenance', value: 0.82 },
  { group: 'Health', value: 1.74 },
  { group: 'Transport', value: 0.76 },
  { group: 'Information, communication & finance', value: -0.34 },
  { group: 'Recreation, sport & culture', value: 1.38 },
  { group: 'Education', value: 1.67 },
  { group: 'Food & beverage services', value: 2.24 },
  { group: 'Personal care & other services', value: 6.18 },
];

// Provinces: population (millions, 2024), GRDP per capita (Rp million, 2024),
// poverty rate (%, Sep 2024). Population and GRDP per capita: BPS.
export const PROVINCES = [
  { name: 'West Java', pop: 50.35, grdpPc: 54.4, poverty: 7.51 },
  { name: 'East Java', pop: 41.81, grdpPc: 73.1, poverty: 9.79 },
  { name: 'Central Java', pop: 37.89, grdpPc: 51.7, poverty: 10.47 },
  { name: 'North Sumatra', pop: 15.59, grdpPc: 68.9, poverty: 7.72 },
  { name: 'Banten', pop: 12.43, grdpPc: 68.3, poverty: 5.84 },
  { name: 'Jakarta', pop: 10.68, grdpPc: 315.3, poverty: 4.14 },
  { name: 'South Sulawesi', pop: 9.49, grdpPc: 66.1, poverty: 8.23 },
  { name: 'Lampung', pop: 9.40, grdpPc: 48.9, poverty: 10.69 },
  { name: 'South Sumatra', pop: 8.88, grdpPc: 68.5, poverty: 11.09 },
  { name: 'Riau', pop: 6.90, grdpPc: 152.4, poverty: 6.17 },
  { name: 'West Sumatra', pop: 5.81, grdpPc: 57.2, poverty: 5.42 },
  { name: 'East Kalimantan', pop: 3.93, grdpPc: 220.5, poverty: 6.05 },
];

// Trade, US$ billion (BPS / Bank Indonesia).
export const TRADE = [
  { year: 2020, exports: 163.2, imports: 141.6 },
  { year: 2021, exports: 231.6, imports: 196.2 },
  { year: 2022, exports: 291.9, imports: 237.4 },
  { year: 2023, exports: 258.8, imports: 221.9 },
  { year: 2024, exports: 264.7, imports: 233.7 },
];

// Latest releases list for the home page.
export const RELEASES = [
  { date: 'Nov 2026', title: 'Poverty rate falls to 8.57% — lowest on record', tag: 'Poverty' },
  { date: 'Nov 2026', title: 'Economy grows 5.03% in 2024; manufacturing leads', tag: 'GDP' },
  { date: 'Oct 2026', title: 'Unemployment at 4.91%, down from 5.32% a year earlier', tag: 'Labour' },
  { date: 'Jan 2026', title: 'Inflation ends 2024 at 1.57%, inside the target band', tag: 'Prices' },
  { date: 'Dec 2025', title: 'HDI reaches 75.02; all provinces improve', tag: 'People' },
];
