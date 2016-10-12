var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');



var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test';
mongoose.connect(connectionString);
var app = express();

var ip   = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var http = require('http').Server(app);
var io = require('socket.io')(http);
//io.set('origins','*');


var WebSiteSchema = new mongoose.Schema({
    Fname: String,
    Lname: String,
    Email: String,

    created:{type:Date, default: Date.now}
}, {collection: 'website'});

var StatisticsSchema = new mongoose.Schema({
    day: String,    
    car: Number,
    boat: Number,
    motor_bike: Number    
}, {collection: 'sale3'});

var WebSiteModel = mongoose.model('WebSite', WebSiteSchema);
var StatisticsModel = mongoose.model('Sales', StatisticsSchema);

var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
      res.header('Access-Control-Allow-Origin','http://fidflex.com'); // only fron this site '*'  
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

/*
var statistic1 = new StatisticsModel(
    {day:"2016-01", car:8, boat:80, motor_bike:150}    
    );
statistic1.save();
*/
 




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

app.use(express.static(__dirname + '/public'));


 /*
app.get('/api/website/:name/create', function(req, res){
    var website = new WebSiteModel({name: req.params.name});
    website.save(function(err,doc){
        res.json(doc);
    });
});

app.get('/api/website/:id', function(req, res){
    WebSiteModel.findById(req.params.id, function(err, site){
        res.json(site);
    });
});


app.get('/process', function(req, res){
   res.json(process.env);
});
*/

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
  });

app.get('/api/sale2', function(req, res){ // statistic get
     StatisticsModel.find(function(err, sit){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        res.json(sit);
    }); 
});

app.options('/api/sale2/:id', function(req, res){	
	res.json({});
});
app.delete('/api/sale2/:id', function(req,res){    
	var id = req.params.id;
    StatisticsModel.remove({_id: id}, function(err, count){
        StatisticsModel.find(function(err, sit){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(sit);
    }); 
    });
});

app.post("/api/sale2", function(req, res){   // staticstic post
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
	  //if( req.body.car !== req.body.car.match(/[0-9]/)){req.body.car = 0;}
      var st_variable = new StatisticsModel(req.body);
      st_variable.save(function(err, doc){       
         StatisticsModel.find(function(err, sites){
		   res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Headers", "X-Requested-With");
           res.json(sites);
         });               
      });    
});

/*
var visitcount = 0;
if(io.on){
io.on('connection', function(socket){
    console.log('a user connected');
    visitcount += 1;
    socket.emit('message',{ 
        message: visitcount
        });
    socket.on('disconnect',function(){
        console.log('user disconnect');

    });
    
    var i = 0;
    setInterval(function(){
        socket.emit('message',{
            message:i
        });
        i++;
    }, 1000); 
});
}
*/ 


//*******************************************************************************
app.get('/api/website', function(req, res){
     WebSiteModel.find(function(err, sit){
        res.json(sit);
    }); 
});

app.delete('/api/website/:id', function(req,res){
    var id = req.params.id;
    WebSiteModel.remove({_id: id}, function(err, count){
        WebSiteModel.find(function(err,sites){
            res.json(sites);
        });
    });
});

app.post("/api/website", function(req, res){ 
    if( req.body.Fname.match(/[a-zA-ZåÅäÄÖö-]+/) == req.body.Fname &&
     req.body.Lname.match(/[a-zA-ZåÅäÄÖö-]+/) == req.body.Lname && 
     req.body.Email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/) == req.body.Email){
     var website = new WebSiteModel(req.body);
     website.save(function(err, doc){       
       WebSiteModel.find(function(err, sites){
        res.json(sites);
       });               
     });
    }
});

app.get('/api/website/:id', function(req, res){  
    var id = req.params.id;
    WebSiteModel.findOne({_id: id}, function(err,doc) {
      res.json(doc)
    });
    
})

app.put('/api/website/:id', function(req, res){
    if( req.body.Fname.match(/[a-zA-ZåÅäÄÖö-]+/) == req.body.Fname &&
     req.body.Lname.match(/[a-zA-ZåÅäÄÖö-]+/) == req.body.Lname && 
     req.body.Email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/) == req.body.Email){
     var id = req.params.id;
     WebSiteModel.findByIdAndUpdate(id,{$set:{ Fname:req.body.Fname, Lname:req.body.Lname, Email:req.body.Email}}, function(err, WebSiteModel){
        if(err){
            console.log(err);
        } else{
            res.json(WebSiteModel);
        }       
     });
    }           
 });



http.listen(port, ip);

