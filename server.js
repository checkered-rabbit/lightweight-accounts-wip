// server.js
// where your node app starts

// init project
const express = require('express');
const accounts = require('./accounts/app');

const app = express();

// Configure view engine to render EJS templates.
app.set('view engine', 'ejs');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// if something adds app.post()
app.use(require('body-parser').urlencoded({ extended: true }));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.render('index',{date: new Date(), user: request.user});
});

accounts.addTo(app);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
