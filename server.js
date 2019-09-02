'use strict';
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(config.dbUrl);
//"mongodb://localhost:27017/nodeDB"
mongoose.connect("mongodb://localhost:27017/nodeDB", {useNewUrlParser: true});
//mongoose.connect(process.env.MONGOLAB_URI, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use(cors());

/** this project needs to parse POST bodies **/
app.use( bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(process.cwd() + '/public'));



app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
//-----------------------------------
var Schema = mongoose.Schema;
var urlSchema = new Schema({
    originalUrl: String,
    shortUrl: String
  });

var urlModel = mongoose.model('urlModel', urlSchema);

var willBePutToDocumentAsUrl ="";
var willBePutToDocumentAsNumber = "";





app.post("/api/shorturl/new", function(req, res) {
	console.log(req.body.url)
	var url = new urlModel({
    originalUrl: req.body.url,
    shortUrl: willBePutToDocumentAsNumber
  });
	//url.originalUrl = req.body;
  url.save(function (err, data) {
  if (err){ console.log(err)  }
  console.log("saved succesfully");
console.log(data)
res.json({greeting: 'hello API'});
});


});


//-----------------------------------
//===============================================

//===============================================
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening on port '+port);
});