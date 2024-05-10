export const environment = {
    production: false,
    baseUrl: 'https://localhost:7162/',
    msalConfig: {
        auth: {
            clientId: 'c85a7b52-403b-43fa-82d3-a06679effb53',
            authority: 'https://login.microsoftonline.com/common'
        }
    },
    redirectUri: 'http://localhost:4200',
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    }
};
