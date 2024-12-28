const setEnv = () => {
    const fs = require('fs');
    const writeFile = fs.writeFile;
    // Configure Angular `environment.ts` file path
    const targetPath = './src/environments/environment.ts';
    // Load node modules
    const appVersion = require('../../package.json').version;
    require('dotenv').config({
        path: 'src/environments/.env'
    });
    // `environment.ts` file structure
    const envConfigFile = `export const environment = {
    appVersion: '${appVersion}',
    production: true,
    baseUrl: 'https://storybackend.azurewebsites.net/',
    storyApiUri: 'https://storybackend.azurewebsites.net/',
    redirectUri: 'https://jonsant.github.io/StoryFrontend/',
    testvar: '${process.env.TESTVAR}'
    vapidKey: '${process.env.VAPIDKEY}'
  };
  `;
    console.log('The file `environment.ts` will be written with the following content:\n');
    writeFile(targetPath, envConfigFile, (err: any) => {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.log(envConfigFile);
            console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
        }
    });
};

setEnv();