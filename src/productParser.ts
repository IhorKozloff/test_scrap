
import type { Page } from "playwright";
import { normalizePrice } from "./helpers/normalizePrice.js";
import { AvailabilityEnum } from "./enums/common.js";

export class ProductParser {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async url() {
        return this.page.url();
    }

    async itemId() {
        const itemId = await this.page.locator('input[name="product_id"]').getAttribute("value");
        return itemId;
    }

    async title() {
        const title = await this.page.locator(".product-detail h2.title").first().textContent();
        return title?.trim() || null;
    };

    async brand() {
        return null;
    };

    async description() {
        const description = await this.page.locator(".product-detail h2.title").first().locator("+ div p").textContent();
        return description?.trim() ?? null;
    };

    async rating() {

        const ratingText = await this.page.locator("#average-rating #average-rating-info").textContent();

        if (!ratingText) {
            return {
                starRating: null,
                reviewRount: null,
            };
        }
 
        const match = ratingText.match(/([\d.]+)\s*\((\d+)\)/);

        return {
            starRating: match ? Number(match[1]) : null,
            reviewRount: match ? Number(match[2]) : null,
        };
    }

    async price() {
        const oldPriceEl = this.page.locator("#price-old");
        const newPriceEl = this.page.locator("#prices-new");

        const oldPriceText = await oldPriceEl.textContent().catch(() => null);
        const newPriceText = await newPriceEl.textContent().catch(() => null);

        if (oldPriceText) {
            return {
                price: normalizePrice(oldPriceText),
                sale_price: normalizePrice(newPriceText),
            };
        }

        return {
            price: normalizePrice(newPriceText),
            salePrice: null,
        };
    }

    async availability(): Promise<AvailabilityEnum | null> {
        const priceContainerEl = this.page
            .locator("#prices-new")
            .locator("..");

        const text = (await priceContainerEl.innerText()).toLowerCase();

        if (text.includes("in stock")) return AvailabilityEnum.IN_STOCK;
        if (text.includes("out of stock")) return AvailabilityEnum.OUT_OF_STOCK;
        if (text.includes("pre-order")) return AvailabilityEnum.PRE_ORDER;

        return null;
    }

    async imageUrl() {
        return await this.page.locator("#imagePopup").getAttribute("src");
    }

    async additionalImageUrls() {

        const imagesElements = this.page.locator("#carouselImages img");

        const popupImages = await imagesElements.evaluateAll(imgs => {
            return imgs.map(img => img.getAttribute("popup_img"));
        });

        const validateUrls = popupImages.filter(src => Boolean(src));
        const uniqUrls = [... new Set(validateUrls)];

        const mainImgUrl = uniqUrls[0];

        const additionalUrls = uniqUrls.slice(1);
        return {
            mainImgUrl,
            additionalUrls
        };
    }

    async category() {
        const categoriesElementsContentText = await this.page.locator(".breadcrumb").innerText();
        const categoriesArr = categoriesElementsContentText.split("\n")
        const validatedCategories = categoriesArr.map(item => item.trim()).filter(Boolean);

        const categoriesWithoutNonCategoriesItems = validatedCategories.slice(1, -1);

        const productCategoryPath = categoriesWithoutNonCategoriesItems.join(" > ");

        return productCategoryPath;
    }

    async categoryTree() {
        const links = this.page.locator(".breadcrumb a");
        const categories = await links.evaluateAll(links => {
            return links.map(link => {

                const name = link.textContent?.trim() || null;
                const url = link.getAttribute("href");

                return {
                    name,
                    url
                };
            });
        });
        const categoryTree = categories.slice(1);

        return categoryTree;
    }

    async specs() {
        const rows = this.page.locator(".product-detail table tr");

        const specs = await rows.evaluateAll(rows => {
            return rows.map(row => {
                const name = row.querySelector("th")?.textContent?.trim() || null;
                const value = row.querySelector("td")?.textContent?.trim() || null;

                return {
                    name,
                    value
                };
            });
        });

        return specs;
    }

    async mpn() {
        const row = this.page.locator("tr").filter({ hasText: "MANUFACTURER NUMBER" }).first();

        const value = await row.locator("td").innerText();

        return value.trim() || null;
    }

    async gtin() {
        const html = await this.page.content();

        const match = html.match(/(?:gtin|ean|upc)[^0-9]{0,30}(\d{8,14})/i);

        return match ? match[1] : null;
    }
}