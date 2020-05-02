const app = require("../../util/app");
const sigUtil = require('eth-sig-util');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const config = require('../../util/config');
const User = require('../../util/models/user-model');

app.post("*", (req, res, next) => {

  const { signature, publicAddress } = req.body;
  if (!signature || !publicAddress){
    res.status(400).end({ error: 'Request should have signature and publicAddress'});
    return
  }

  User.findOne({ publicAddress })
    // Get the user with the gived publicAddress
    .then((user) => {
      if (!user)
        return res.status(401).send({
          error: `User with publicAddress ${publicAddress} is not found in database`
        });
      return user;
    })
    // Verify digital signature
    .then((user) => {

      const msg = `MetaMask Login Sample (One-time token: ${user.nonce})`;
      
      // We now are in possession of msg, publicAddress and signature.
      // We will use a helper from eth-sig-util to extract the address from the signature
      const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
      const address = sigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature
      })
      
      // The signature verification is successful if the adress found
      // sigUtil.recoverPersonalSignature matches the initial publicAddress
      if (address.toLowerCase() === publicAddress.toLowerCase()){
        return user;
      } else {
        return res.status(401).send({ error: 'Signature verification failed.'});
      }
    })
    // Generate a new nonce for the user
    .then(() => {
      const nonce = Math.floor(Math.random() * 1000000);
      return User.findOneAndUpdate({ publicAddress }, {$set: {nonce: nonce}})
    })
    // Create JWT
    .then((user) => {
      return jwt.sign(
        {
          id: user._id,
          publicAddress
        },
        config.secret,
        {})
    })
    .then(accessToken => res.json({ accessToken }))
    .catch(next)
    
});
  
module.exports = app;