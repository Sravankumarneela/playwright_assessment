import * as dotenv from 'dotenv';

export const getEnv = () => {
    dotenv.config({
        override: true,
        path: `tests/helpers/Environment/.env.${process.env.ENV}`,
    })

}