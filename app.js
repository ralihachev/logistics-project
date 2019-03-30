//firstly import all required libraries using require
var express = require('express');
var url=require('url');
var MongoClient = require('mongodb').MongoClient;
var bodyParser=require('body-parser');

//creating an app
var app = express();

//setting the ejs view for the app as the main file is .ejs (for combining html with js). The .ejs file has to be  in views folder
app.set('view engine', 'ejs');

//bodyParser is needed to get the data from the body of the website
app.use(bodyParser.urlencoded({ extended: false }));

//port, where the application will be running
var port=process.env.PORT || 8080;

//getting the main page
app.get('/', function (req, res){
    res.render('main.ejs')
});

//connecting to database
MongoClient.connect('mongodb://ralihachev:Centriaprojects2018@ds127736.mlab.com:27736/logistics', function (err, client){
   if (err) throw err;
    console.log('Connected to database');
    db=client.db('logistics');
    app.listen(port);
    console.log('App is running on 8080');
});

//post method for posting data from company input form into the database collection 'logcompanydata'
app.post('/insert', function (req, res){
    var myobj={
        company: req.body.companyname,
        origin: req.body.origincity,
        destination: req.body.destinationcity,
        depdate: req.body.departuredate,
        arrdate: req.body.arrivaldate,
        avaliablespace: req.body.avaliablespace,
        transporttype: req.body.transporttype
    };
    db.collection('logcompanydata').insertOne(myobj, function (err, res){
        if (err) throw err;
        console.log('Item inserted');
    });
    res.send('Item posted');  //sends 'Item posted' as a response to the website
});


//get method for getting data from database for our search form, result is displayed in the console
app.get('/search', function (req, res){
    var q=url.parse(req.url, true);
    var qdata= q.query;
    db.collection('logcompanydata').find({}).toArray(function(err, result){
        if (err) throw err;
        console.log(result)
    });
    res.send('Search for the found results in the console')
});


