import { Page } from "playwright";
import { Logger } from "winston";
import { LoginPage } from "../FinsRetail/pages/LoginPage";
import { MutualFundPage } from "../FinsRetail/pages/MutualFundPage";
import { PortfolioPage } from "../FinsRetail/pages/PortfolioPage";
import { InsurancePage } from "../FinsRetail/pages/InsurancePage";
import { PoliciesPage } from "../FinsRetail/pages/PoliciesPage";
import { TransactionsPage } from "../FinsRetail/pages/TransactionsPage";
import { SupportPage } from "../FinsRetail/pages/SupportPage";

export const pageFixture = {
    // @ts-ignore
    page: undefined as Page,
    // @ts-ignore
    logger: undefined as Logger,

    loginPage: undefined as unknown as LoginPage,
    mutualFundPage: undefined as unknown as MutualFundPage,
    portfolioPage: undefined as unknown as PortfolioPage,
    insurancePage: undefined as unknown as InsurancePage,
    policiesPage: undefined as unknown as PoliciesPage,
    transactionsPage: undefined as unknown as TransactionsPage,
    supportPage: undefined as unknown as SupportPage
}