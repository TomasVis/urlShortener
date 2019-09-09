'use strict';
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
var app = express();
var router = express.Router();
const dns = require('dns');

// Basic Configuration 
var port = process.env.PORT || 80;

/** this project needs a db !! **/ 

//mongoose.connect("mongodb://localhost:27017/a" , {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONECTION TO DB HAS BEEN ESTABLISHED")
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
    shortUrl: Number
  });

var urlModel = mongoose.model('urlModel', urlSchema);



  			
app.post("/api/shorturl/new", function(req, res) {
		findUrl(req.body.url,function(err,data){
			if(err) { return (next(err)); }	
			var lookup = req.body.url.replace("https://www.","").replace(/\/(.*)$/,"")
			dns.lookup(lookup, function (err, addresses, family) {	
			console.log(lookup)	
			//console.log("freecaodecamp.org/forum")		 
		    if(data == null)  	{										// if such entry does not exist in database
		    	if(typeof addresses != "string"){						// if not valid url
		    		res.json({"error":"invalid URL"})				
		    	}
		    	else if(typeof addresses == "string"){	
				generateShorCode(function(err, shortCode){
					if(err) { return (next(err)); }
				saveUrl(req.body.url, shortCode +1, function(err, doc){
					if(err) { return (next(err)); }
					res.json(doc)
				});
				});
			}
				
		    }	
		    else {

		    	res.json(data)
		    }
		    });	
	});
			
});

app.get("/api/shorturl/:dashorturl", function(req,res){
	console.log("inside app.get")
	console.log(!isNaN(req.params.dashorturl))
	if(!isNaN(req.params.dashorturl)){
		console.log("inside if")
		findShort(Number(req.params.dashorturl),function(err, data){
			console.log("inside findShort")
			if(err) { return (next(err)); }	

			res.redirect(data.originalUrl);

		})
		
	}
	if(isNaN(req.params.dashorturl)){
		res.send("Short url must be a number");
	}
	//res.send({dashorturl: req.params.dashorturl});
  //console.log(req.params.dashorturl);

})

var findShort = function(thingToFind, callback) {
console.log("inside findShort")
	urlModel.findOne({shortUrl:thingToFind}, function(err, data){
		if (err) return handleError(err);
console.log("inside findone")
			callback(null , data);
			//console.log("ar suveikia")
});
}


var generateShorCode = function(callback){

	urlModel.count({}, function(err, count){
		if (err) return handleError(err);

		console.log("count inside generate shortcode "+count)
		callback(null , count);
	});
}

var saveUrl = function(thingToSave, shortUrlNum, callback) {
	//console.log("5")
	var url = new urlModel({
			originalUrl: thingToSave,
			shortUrl: shortUrlNum
				});
	url.save(function (err, doc) {
		if (err) return handleError(err);

		console.log("6")
			callback(null , doc);
});
}
var findUrl = function(thingToFind, callback) {

	urlModel.findOne({originalUrl:thingToFind}, function(err, data){
		if (err) return handleError(err);

			callback(null , data);
			//console.log("ar suveikia")
});
}



//-----------------------------------
//===============================================
//var createPerson = require('./myApp.js').createAndSavePerson;

app.get('/create-and-save-person', function(req, res, next) {
  console.log("1")
  // in case of incorrect function use wait timeout then respond
 
  createAndSavePerson(function(err, data) {
    console.log("4")

    if(err) { return (next(err)); }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
     Person.findById(data._id, function(err, pers) {
       console.log("5")
       if(err) { return (next(err)); }
       res.json(pers);
       //pers.remove();
     });
  });
});

 var Schema = mongoose.Schema;
var personSchema = new Schema({
    name:  {type: String,
           required:true},
    age: Number,
    favoriteFoods: [String],
  });

var Person = mongoose.model('Person', personSchema);
var petras = new Person({
    name:  "Petras",
    age: 25,
    favoriteFoods: ["alus", "Snapsas"]
  });

function handleError(err){
  console.log("KLAIDA: "+err);
}



var createAndSavePerson = function(done) {
  console.log("2")
  petras.save(function (err, data) {
  if (err) return handleError(err);
  console.log("3");
    //console.log(data)
      done(null , data);
});
  


};
//===============================================
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening on port '+port);
});