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
    msalApiUrl: 'https://graph.microsoft.com/v1.0/me',
    msalApiScopes: ['user.read'],
    msalClientId: '${process.env.msalClientId}',
    msalAuthority: '${process.env.msalAuthority}',
    storyApiScopes: ${process.env.storyApiScopes},
    appVersion: '${appVersion}',
    production: true,
    baseUrl: 'https://storybackend.azurewebsites.net/',
    storyApiUri: 'https://storybackend.azurewebsites.net/',
    redirectUri: 'https://jonsant.github.io/StoryFrontend/',
    testvar: '${process.env.testvar}'
  };
  `;
    console.log('The file `environment.ts` will be written with the following content: \n');
    writeFile(targetPath, envConfigFile, (err: any) => {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
        }
    });
};

setEnv();