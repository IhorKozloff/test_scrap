# MSI Product Scraper

A product scraper built with **TypeScript** and **Playwright**.

## Installation

Install the project dependencies:

```bash
npm install
```

## Run

Start the scraper with:

```bash
npm run scrape
```

This command:

- Compiles the TypeScript source code
- Runs the scraper with Node.js
- Saves the scraped product data to `output/product.json`

## Output

The scraped product data is saved to:

```text
output/product.json
```

## Scraped Fields

The scraper collects:

- URL
- Item ID
- Title
- Brand
- Description
- Rating and review count
- Price and sale price
- Availability
- Main and additional image URLs
- Product category
- Category tree
- Specifications
- MPN
- GTIN
- Scraping timestamp

## Note

The `brand` field was implemented, but a reliable brand value could not be found in the page DOM or available product data.

Therefore, the `brand` field may return `null`.
