import { chromium } from "playwright";
import { ProductParser } from './productParser.js';
import { appConfig } from "./config/app.config.js";
import { writeFile } from "node:fs/promises";

const main = async () => {
    const SCRAPE_URL = appConfig.DEFAULT_URL;

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(
        SCRAPE_URL,
        {
            waitUntil: "domcontentloaded"
        }
    );
    const parse = new ProductParser(page);

    const [
        url,
        itemId,
        title,
        brand,
        description,
        rating,
        prices,
        availability,
        images,
        categoryPath,
        categoryTree,
        specs,
        mpn,
        gtin
    ] = await Promise.all([
        parse.url(),
        parse.itemId(),
        parse.title(),
        parse.brand(),
        parse.description(),
        parse.rating(),
        parse.price(),
        parse.availability(),
        parse.additionalImageUrls(),
        parse.category(),
        parse.categoryTree(),
        parse.specs(),
        parse.mpn(),
        parse.gtin()
    ]);
    const { starRating, reviewRount } = rating;
    const { price, salePrice } = prices;
    const { mainImgUrl, additionalUrls } = images;
    const scrapedAt = new Date().toISOString();

    const result = {
        url,
        item_id: itemId,
        title,
        brand,
        description,
        star_rating: starRating,
        review_count: reviewRount,
        price,
        sale_price: salePrice,
        availability,
        image_url: mainImgUrl,
        additional_image_urls: additionalUrls,
        product_category: categoryPath,
        category_tree: categoryTree,
        specs,
        mpn,
        gtin,
        scraped_at: scrapedAt
    };
    console.log(result)
    await writeFile(
        "output/product.json",
        JSON.stringify(result, null, 2),
        "utf-8"
    );

    await page.waitForTimeout(5000);

    await browser.close();
};


main();