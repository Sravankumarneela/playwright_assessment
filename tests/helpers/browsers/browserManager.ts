import { chromium, firefox, LaunchOptions, webkit } from "playwright";

const getLaunchOptions = (): LaunchOptions => {
    const headlessValue = process.env.HEADLESS?.trim().toLowerCase();

    if (headlessValue !== "true" && headlessValue !== "false") {
        throw new Error('HEADLESS must be set to either "true" or "false"');
    }

    const headless = headlessValue === "true";

    return {
        headless,
        args: headless ? [] : ["--start-maximized"]
    };
};

export const invokeBrowser = async () => {
    const browserType = process.env.BROWSER;
    const options = getLaunchOptions();

    switch (browserType) {
        case "chromium":
           return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error(`Browser not supported: ${browserType}`);
    }
}