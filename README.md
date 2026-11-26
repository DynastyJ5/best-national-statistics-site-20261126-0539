# DataNusa — Portal Statistik Indonesia

A national statistics site for Indonesia: population, economy, labour,
prices, and regions — published figures with their source and year,
presented as a fast static site with no network requests.

## What it is

- **Home** — hero + 8 headline indicators (population, GDP, GDP per capita,
  inflation, unemployment, poverty, HDI, life expectancy), population and
  GDP-growth charts with a year-range switch, latest releases.
- **Economy** — GDP by sector, growth chart (line/bar switch), trade table.
- **Population** — age-structure donut, population chart, sortable +
  searchable province table.
- **Labour** — unemployment trend, employment by sector, key facts.
- **Prices** — CPI inflation trend, poverty trend, inflation by expenditure group.
- **Regions** — population by province chart, sortable comparison table.
- **Sources** — every publication the figures come from, plus method notes.

All figures are rounded from Statistics Indonesia (BPS), Bank Indonesia,
and World Bank publications, each labelled with source and year.
DataNusa is an original presentation of public figures, not an official
BPS site.

## Run it

```sh
node serve.ts          # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to the
output directory and writes `output/dossier.json` with `buildDossier`
from `vendor/makefun-frontend.ts` (the kit's copy, unchanged).

## Screenshots

Real headless-Chromium renders of the site's own code (see `shots.json`):
`1-home.jpg` (cover), `2-economy.jpg`, `3-population.jpg`,
`4-regions-phone.jpg` (small-screen view, 500 px wide — the headless
browser used here enforces a 500 px minimum layout width).
