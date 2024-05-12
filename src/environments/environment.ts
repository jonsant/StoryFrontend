export const environment = {
    production: true,
    baseUrl: 'https://storybackend.azurewebsites.net/',
    msalConfig: {
        auth: {
            clientId: '',
            authority: 'https://login.microsoftonline.com/'
        }
    },
    redirectUri: 'https://jonsant.github.io/StoryFrontend/',
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    },
    storyApiConfig: {
        scopes: [''],
        uri: 'https://storybackend.azurewebsites.net/'
    }
};
