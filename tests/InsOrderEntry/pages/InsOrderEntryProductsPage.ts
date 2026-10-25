import { expect, Page } from "playwright/test";
import data from "../testdata/InsOrderEntrydata.json";

type ProductKey = keyof typeof data.products.catalog;

export class InsOrderEntryProductsPage {
    constructor(private readonly page: Page) {}

    async openFromNavigation(): Promise<void> {
        await this.page.getByTestId(data.products.testIds.navigationLink).click();
        await expect(this.page.getByRole("heading", { name: data.products.catalogHeading })).toBeVisible();
    }

    async expectProductCard(productKey: string): Promise<void> {
        const product = data.products.catalog[productKey as ProductKey];

        await expect(this.page.getByText(product.catalogText)).toBeVisible();
        await expect(this.page.getByRole("heading", { name: product.name })).toBeVisible();
        await expect(this.page.getByText(product.catalogSummary)).toBeVisible();
        await expect(this.page.getByTestId(`${data.products.testIds.detailsButtonPrefix}${product.code}`)).toBeVisible();
    }

    async openProductDetails(productKey: string): Promise<void> {
        const product = data.products.catalog[productKey as ProductKey];
        await this.page.getByTestId(`${data.products.testIds.detailsButtonPrefix}${product.code}`).click();
    }

    async expectProductDetails(productKey: string): Promise<void> {
        const product = data.products.catalog[productKey as ProductKey];

        await expect(this.page.getByTestId(data.products.testIds.detailPage)).toBeVisible();
        await expect(this.page.getByTestId(data.products.testIds.productName)).toHaveText(product.name);
        await expect(this.page.getByText(product.code)).toBeVisible();
        await expect(this.page.getByText(data.products.type)).toBeVisible();
        await expect(this.page.getByText(product.ageRange)).toBeVisible();
        await expect(this.page.getByText(product.minSumAssured)).toBeVisible();
        await expect(this.page.getByText(product.maxSumAssured)).toBeVisible();
        await expect(this.page.getByRole("heading", { name: data.products.featuresHeading })).toBeVisible();
        await expect(this.page.getByTestId(data.products.testIds.features)).toBeVisible();
    }

    async expectBackLink(): Promise<void> {
        await expect(this.page.getByTestId(data.products.testIds.backLink)).toBeVisible();
    }
}