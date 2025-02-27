const {JWKS_URI} = require('./config');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const verifyJWT = (req, res, next) => {
  const client = jwksClient({
    jwksUri: JWKS_URI,
    caches: true,
    rateLimit: false
  });

  const token = req.headers['authorization']?.split(' ')[1];
  const decodedToken = jwt.decode(token, {complete: true});
  if (!token && (!decodedToken || !decodedToken.header || !decodedToken.header.kid)) {
    return res.status(401).json({ message: 'No token provided' });
  }
  client.getSigningKey(decodedToken.header.kid).then((res) => {
    const signingKey = res.publicKey || res.rsaPublicKey;
    let j = jwt.verify(token, signingKey);
    req.body.uin = j.sub
    next();
    // check the type of the data returned in JS and do the stuff
  }).catch(err => {
    console.log('error: ', err);
    return res.status(401).json({ message: 'invalid token' });
  });
};

module.exports = {
  verifyJWT,
};
