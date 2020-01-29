var MongoClient = require('mongodb').MongoClient; 
var url = "mongodb://localhost:27017/nishkarsh";
let express=require('express');
let server=express();
let path=require('path');
let bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:true});
server.set('view engine','ejs');
server.use(express.static(__dirname));
var formidable = require('formidable');
var main ;
var n;
var n1;
server.get('/home',function(req,res)
{
  res.sendFile(__dirname+'/webproject.html');
});
//creating a new user
server.post('/info',urlencodedParser,function(req,res)
{
if(req.body.usename!==undefined)
{
    //creating an object to insert into our database
    main = { name: req.body.usename, email: req.body.emailaddress,mobile:req.body.mobile,password:req.body.password,
           src:"undefined1.png"};
  //printing object to check
  console.log(main);
  //connecting with mongodb and saving in mongodb
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nishkarsh");//database name and collection name
  dbo.collection('nishkarsh').insertOne(main, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}
    //login user with name and password
res.sendFile(__dirname+'/login.html');
});
server.post('/portal',urlencodedParser,function(req,res)
{
    n=req.body.username;
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
    /*if(main.name===name && main.password===req.body.password)
        {
            res.render('completeprofile',{profileData:main});
        }
    else
        {
            res.send("error");
        }*/
});
//logout funtion
server.get('/info',function(req,res)
{
  res.sendFile(__dirname+'/login.html');
});
//update function
server.post('/update',function(req,res)
{
  res.sendFile(__dirname+'/update.html');
});
server.post('/updation',urlencodedParser,function(req,res)
{
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
       n1={name:req.body.username1};
 });

});
server.post('/updated',urlencodedParser,function(req,res)
{
    main = { name: req.body.name2, email: req.body.emailaddress2,mobile:req.body.mobile2,password:req.body.password2,src:req.body.source };
    /*
    console.log(main);*/
  //printing object to check
  console.log(main);
  //res.render('completeprofile',{profileData:main});
  //connecting with mongodb and saving in mongodb
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nishkarsh");//database name and collection name
  var myquery = n1;
  var newvalues = {$set: { name: req.body.name2, email: req.body.emailaddress2,mobile:req.body.mobile2,password:req.body.password2,src:req.body.source } };
  dbo.collection("nishkarsh").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close(); 
  });
}); 
    n =req.body.name2;
    res.render('completeprofile',{profileData:main});
  });
server.post('/delete',function(req,res)
{
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("nishkarsh");
    var myquery = { name: n };
    dbo.collection("nishkarsh").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    });
});
    res.sendFile(__dirname+'/webproject.html');
});
//search user   
server.post('/search',urlencodedParser,function(req,res)
{
      var name=req.body.search;
      MongoClient.connect(url, function(err, db) {
       if (err) throw err;
      var dbo = db.db("nishkarsh");
dbo.collection('nishkarsh').findOne({ name:req.body.search}, function(err, user) 
{
    if(user===null)
        {
               res.end("Login invalid");
        }
    else if (user.name === req.body.search)
        {
            res.render('search2',{profileData:user});
        } 
    else 
        {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }
   });
 });
});
server.listen(3000);
console.log('server created');
