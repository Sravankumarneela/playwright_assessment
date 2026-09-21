import { Page } from "playwright";
import { Logger } from "winston";
import { LoginPage } from "../FinsRetail/pages/LoginPage";
import { MutualFundPage } from "../FinsRetail/pages/MutualFundPage";

export const pageFixture = {
    // @ts-ignore
    page: undefined as Page,
    // @ts-ignore
    logger: undefined as Logger,

    loginPage: undefined as unknown as LoginPage,
    mutualFundPage: undefined as unknown as MutualFundPage
}