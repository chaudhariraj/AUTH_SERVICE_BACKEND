// import { config } from "dotenv";
// import path from 'path';

// config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

// const { PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PORT, DB_PASSWORD, DB_NAME } = process.env;

// export const Config = {
//   PORT: PORT || 5502,
//   NODE_ENV,
//   DB_HOST, 
//   DB_USERNAME,  
//   DB_PORT, 
//   DB_PASSWORD, 
//   DB_NAME
// };  

import { config } from "dotenv";
import path from 'path';

// Load environment variables based on NODE_ENV
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PORT, DB_PASSWORD, DB_NAME } = process.env;

export const Config = {
  PORT: PORT || 5501,
  NODE_ENV: NODE_ENV || 'development',
  DB_HOST: DB_HOST || 'localhost',
  DB_USERNAME: DB_USERNAME || 'postgres',
  DB_PORT: DB_PORT || '5432',
  DB_PASSWORD: DB_PASSWORD || 'root',
  DB_NAME: DB_NAME || 'mernstack-auth-service'
};  
