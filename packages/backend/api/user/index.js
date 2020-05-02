const app = require("../../util/app");
const jwt = require('express-jwt');
const config = require('../../util/config');
const User = require('../../util/models/user-model');
const mongoose = require('mongoose');

app.get("*", jwt({secret: config.secret}), (req, res) => {
  // AccessToken payload in req.query.id
  // We only allow user accessing herself, i.e., require id==userId
  if (req.user.id !== req.query.id) {
    res.status(401).end({ error: 'You can only access yourself.'})
    return
  } else {
    User.findOne({"_id": mongoose.Types.ObjectId(req.query.id)})
      .then((user) => {
        res.end(JSON.stringify(user));
      })
  }
});

app.patch("*", jwt({secret: config.secret}), (req, res) => {
  // Only allow to fetch current user
  if (req.user.id !== req.query.id) {
    res.status(401).end({ error: 'You can only access yourself.'})
  } else {

    User.findOneAndUpdate(
      {"_id": mongoose.Types.ObjectId(req.query.id)},
      {$set: {username: req.body.username}}
    )
      .then((user) => {
        user.username = req.body.username
        res.end(JSON.stringify(user));
      })
  }

});

module.exports = app;