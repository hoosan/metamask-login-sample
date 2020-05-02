const app = require("../../util/app");
const User = require('../../util/models/user-model');

app.get("*", (req, res) => {

  // If a query string ?publicAddress=... is given, then filter results  
  // console.log(req.query.publicAddress)
  User.findOne({ publicAddress: req.query.publicAddress })
    .then((user) => {
      res.end(JSON.stringify({user}));
    })

});

app.post("*", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.end(JSON.stringify(user))
    })
})

module.exports = app;