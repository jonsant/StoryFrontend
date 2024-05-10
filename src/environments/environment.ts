export const environment = {
    production: true,
    baseUrl: 'https://storybackend.azurewebsites.net/',
    msalConfig: {
        auth: {
            clientId: 'c85a7b52-403b-43fa-82d3-a06679effb53',
            authority: 'https://login.microsoftonline.com/common'
        }
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    }
};
