

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chromium" | "firefox" | "webkit";
            HEADLESS: "true" | "false";
            BASEURL: string;
            ENV: "dev" | "qa" | "staging" | "prod";
        }
    }
}