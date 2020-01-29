var MongoClient = require('mongodb').MongoClient; 
var url = "mongodb://localhost:27017/nishkarsh";
let express=require('express');
let server=express();
let path=require('path');
let bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:true});
server.set('view engine','ejs');
server.use(express.static('./public'));
server.get('/home',function(req,res)
{
  res.sendFile(__dirname+'/webproject.html');
});
server.post('/info',urlencodedParser,function(req,res)
{
if(req.body.usename!==undefined)
{
    //creating an object to insert into our database
  var myobj = { name: req.body.usename, email: req.body.emailaddress,mobile:req.body.mobile,password:req.body.password };
  //printing object to check
  console.log(myobj);
  //connecting with mongodb and saving in mongodb
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nishkarsh");//database name and collection name
  dbo.collection('nishkarsh').insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}
res.sendFile(__dirname+'/login.html');
});
server.post('/portal',urlencodedParser,function(req,res)
{
var name=req.body.username;
    //connecting with database and confirming whether usename or password matches
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("nishkarsh");
dbo.collection('nishkarsh').findOne({ name:req.body.username}, function(err, user) 
{
    if(user===null)
        {
               res.end("Login invalid");
        }
    else if (user.name === req.body.username && user.password === req.body.password)
        {
            res.render('completeprofile',{profileData:user});
        } 
    else 
        {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }
   });
 });
});
//logout funtion
server.get('/info',function(req,res)
{
  res.sendFile(__dirname+'/login.html');
});
//update function
server.get('/update',function(req,res)
{
  res.sendFile(__dirname+'/update.html');
});
//veryfying username and password for updation of user
server.post('/updation',urlencodedParser,function(req,res)
{
    var name=req.body.username;
    //connecting with database and confirming whether usename or password matches
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("nishkarsh");
    dbo.collection('nishkarsh').findOne({ name:req.body.username1}, function(err, user) {
    if(user===null)
            {
            res.end("Login invalid");
            }
    else if (user.name === req.body.username1 && user.password === req.body.password1)
           {
            res.render('updateprofile',{profileData:user});
           } 
    else 
          {
            console.log("Credentials wrong");
            res.end("Login invalid");
          }
   });
 });
});
server.post('/updated',urlencodedParser,function(req,res)
{
    var myobj = { name: req.body.name2, email: req.body.emailaddress2,mobile:req.body.mobile2,password:req.body.password2 };
  //printing object to check
  console.log(myobj);
  //connecting with mongodb and saving in mongodb
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nishkarsh");//database name and collection name
  var myquery = { name: req.body.name1 };
  var newvalues = {$set: {address: "Canyon 123"} };
  dbo.collection("nishkarsh").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close(); 
    res.render('completeprofile',{profileData:myobj});
});
server.listen(3000);
console.log('server created');
