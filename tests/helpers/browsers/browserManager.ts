import { chromium, firefox, LaunchOptions, webkit } from "playwright";


const options: LaunchOptions = {
    headless: false,
    args: ["--start-maximized"],
};

export const invokeBrowser = async () => {
    const browserType = process.env.BROWSER;
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