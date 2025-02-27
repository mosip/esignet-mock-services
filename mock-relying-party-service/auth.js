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
  client.getSigningKey(decodedToken.header.kid, (err, key) => {
    if (err) {
      console.error('error getting signing key: ', err);
      return res.status(401).json({message: 'Unauthorized'});
    }
    console.log("here");
    const signingKey = key.publicKey || key.rsaPublicKey;
    jwt.verify(token, signingKey, {algorithms: ['RS256']}, (err, decoded) => {
      console.log("here2");
      if (err) {
        console.error('token verification failed', err);
        return res.status(401).json({message: 'Unauthorized'});
      }
      console.log("here3");
    req.body.uin = decoded.payload.sub;
    })
  });
  next();
};
module.exports = {
  verifyJWT,
};
