const jwt = require('jsonwebtoken');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var bearer = req.headers.authorization.split(' ');
    bearerToken = bearer[1];
    var decoded = jwt.decode(bearerToken);

    context.log(decoded);

    if (!!decoded.upn) {
        decoded.preferred_username = decoded.upn.toLowerCase();
    } else {
        decoded.preferred_username = decoded.preferred_username.toLowerCase();
    }

    context.res = {
        body: [decoded]
    };
}