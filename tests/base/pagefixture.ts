import { Page } from "playwright";
import { Logger } from "winston";

export const pageFixture = {
    // @ts-ignore
    page: undefined as Page,
    // @ts-ignore
    logger: undefined as Logger
}