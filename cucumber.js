const now = new Date();
const pad = (value) => String(value).padStart(2, "0");
const timestamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
].join("");

module.exports = {
    default: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "tests/FinsRetail/features/*.feature"
        ],
        dryRun: false,
        require: [
            "tests/base/*.ts",
            "tests/FinsRetail/steps/*.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            `html:reports/cucumber-report-${timestamp}.html`
        ],
        parallel: 1
    }
};
