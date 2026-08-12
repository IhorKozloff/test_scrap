export const normalizePrice = (price: string | null): number | null => {
    if (!price) {
        return null;
    }

    const normalized = price.replace(/[$,]/g, "").trim();

    const result = Number(normalized);

    return Number.isNaN(result) ? null : result;
}