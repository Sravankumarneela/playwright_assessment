import { Page } from "playwright";
import { Logger } from "winston";
import { InsOrderEntryLoginPage } from "../InsOrderEntry/pages/InsOrderEntryLoginPage";
import { InsOrderEntryProductsPage } from "../InsOrderEntry/pages/InsOrderEntryProductsPage";
import { InsOrderEntrySupportPage } from "../InsOrderEntry/pages/InsOrderEntrySupportPage";
import { InsOrderEntryApplicationsPage } from "../InsOrderEntry/pages/InsOrderEntryApplicationsPage";
import { InsOrderEntryDashboardPage } from "../InsOrderEntry/pages/InsOrderEntryDashboardPage";

export const pageFixture = {
    page: undefined as unknown as Page,
    logger: undefined as unknown as Logger,
    loginPage: undefined as unknown as InsOrderEntryLoginPage,
    productsPage: undefined as unknown as InsOrderEntryProductsPage,
    supportPage: undefined as unknown as InsOrderEntrySupportPage,
    applicationsPage: undefined as unknown as InsOrderEntryApplicationsPage,
    dashboardPage: undefined as unknown as InsOrderEntryDashboardPage
}