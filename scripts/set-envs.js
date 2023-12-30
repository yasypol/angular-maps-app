/**
 * Este script se invocará desde el comando definido en package.json:
 * "envs": "node ./scripts/set-envs.js",
 */

const { writeFileSync, mkdirSync, mkdir } = require ('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

// Esto genera la estructura del archivo environments.ts
const envFileContent = `
export const environment = {
  mapbox_key: '${ process.env['MAPBOX_KEY'] }',
};
`;

// Crea la carpeta si no existe
mkdirSync('./src/environments', { recursive: true });

// Genera el archivo environments.ts
writeFileSync( targetPath, envFileContent );
