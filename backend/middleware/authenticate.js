const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const AUTH0_DOMAIN = 'dev-5t7vf2fdg1cniw67.us.auth0.com';
const AUTH0_AUDIENCE = 'https://learningmanagementsystem-api';

const authenticate = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = authenticate;