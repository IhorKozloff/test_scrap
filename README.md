# MSI Product Scraper

A product scraper built with **TypeScript** and **Playwright**.

## Installation

Install the project dependencies:

```bash
npm install
Run

Start the scraper with:

npm run scrape

This command:

Compiles the TypeScript source code.
Runs the scraper with Node.js.
Saves the scraped product data to output/product.json.
Output

The scraped product data is saved to:

output/product.json
Scraped Fields

The scraper collects the following product information:

URL
Item ID
Title
Brand
Description
Rating
Review count
Price
Sale price
Availability
Main image URL
Additional image URLs
Product category
Category tree
Specifications
MPN
GTIN
Scraping timestamp
Brand

The brand field has been implemented, but a reliable brand value could not be found in the page DOM or available product data.

Therefore, the brand field may return:

null
