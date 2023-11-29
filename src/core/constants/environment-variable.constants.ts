import * as dotenv from 'dotenv';

dotenv.config();

export const { DB_USER } = process.env;

export const { DB_PASSWORD } = process.env;

export const { DB_HOST } = process.env;

export const { DB_PORT } = process.env;

export const { DIALECT } = process.env;

export const { DATABASE } = process.env;
