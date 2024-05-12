export const environment = {
    production: false,
    baseUrl: 'https://localhost:7162/',
    msalConfig: {
        auth: {
            clientId: '',
            authority: 'https://login.microsoftonline.com/'
        }
    },
    redirectUri: 'http://localhost:4200',
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    },
    storyApiConfig: {
        scopes: [''],
        uri: 'https://localhost:7162/'
    }
};
