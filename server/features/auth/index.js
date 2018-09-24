const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

module.exports = app => {
    const stsAuthority = appConfig.stsAuthority;
    const audience = appConfig.stsClient;

    app.all('/api/*', jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 2,
            jwksUri: `${stsAuthority}/.well-known/openid-configuration/jwks`
        }),
        audience: audience,
        issuer: stsAuthority,
        algorithms: ['RS256']
    }));

}    
