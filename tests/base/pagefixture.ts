import { Page } from "playwright";
import { InsOrderEntryLoginPage } from "../InsOrderEntry/pages/InsOrderEntryLoginPage";
import { InsOrderEntryProductsPage } from "../InsOrderEntry/pages/InsOrderEntryProductsPage";
import { InsOrderEntrySupportPage } from "../InsOrderEntry/pages/InsOrderEntrySupportPage";
import { InsOrderEntryApplicationsPage } from "../InsOrderEntry/pages/InsOrderEntryApplicationsPage";

export const pageFixture = {
    page: undefined as unknown as Page,
    loginPage: undefined as unknown as InsOrderEntryLoginPage,
    productsPage: undefined as unknown as InsOrderEntryProductsPage,
    supportPage: undefined as unknown as InsOrderEntrySupportPage,
    applicationsPage: undefined as unknown as InsOrderEntryApplicationsPage
}