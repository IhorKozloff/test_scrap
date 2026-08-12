MSI Product Scraper

A product scraper built with TypeScript and Playwright.

Installation
npm install
Run
npm run scrape

This builds the TypeScript project and then runs the scraper.

The scraped product data is saved to:

output/product.json
Scraped fields

The scraper collects:

URL
Item ID
Title
Brand
Description
Rating and review count
Price and sale price
Availability
Main and additional image URLs
Product category
Category tree
Specifications
MPN
GTIN
Scraping timestamp
Note

The brand field was implemented, but a reliable brand value could not be found in the page DOM or available product data. Therefore, it may return null.
