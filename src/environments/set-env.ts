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
    testvar: '${process.env.TESTVAR}',
    vapidKey: '${process.env.VAPIDKEY}',
    firebaseConfig: {
        "projectId": "storyfrontend-pwa",
        "appId": "1:582938887093:web:d05ac52729d89f6a774ffc",
        "storageBucket": "storyfrontend-pwa.firebasestorage.app",
        "apiKey": "AIzaSyAoyYKjh2Mvr2BZ9PlVASMfz4k0Pffxr9I",
        "authDomain": "storyfrontend-pwa.firebaseapp.com",
        "messagingSenderId": "582938887093",
        "measurementId": "G-1621V7KCKC"
    }
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