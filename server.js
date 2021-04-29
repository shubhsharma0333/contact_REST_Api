const express = require("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://shubh-admin:shubh-admin@cluster0.3wpoe.mongodb.net/contactDB", { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
  name:String,
  phoneNumber:String,
  email:String,
  jobTitle: String
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/contacts", function(req, res){
  Contact.find(function(err, result){
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  });
});


app.post("/contacts", function(req, res){

  const newContact = new Contact({
      name:req.body.name,
      phoneNumber:req.body.phoneNumber,
      email:req.body.email,
      jobTitle:req.body.jobTitle
  });
  newContact.save(function(err){
    if(!err){
      res.send("Contact added successfully!")
    }
  });
});

app.post("/contacts", function(req, res){                //DELETE ALL
  Contact.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all the contatcts!")
    }else{
      res.send(err);
    }
  });
});


app.get("/contacts/:contactName", function(req, res){           //get a specific contact by name
  Contact.findOne({name:req.params.contactName}, function(err, result){
    if(err){
      res.send(err);
    }
    else{
      res.send(result);
    }
  });
});

app.put("/contacts/:contactName", function(req, res){             //find and update the whole contact
  Contact.update(
    {name:req.params.contactName},
    {name: req.body.name, phoneNumber: req.body.phoneNumber,email:req.body.email ,jobTitle:req.body.jobTitle},
    {overwrite: true}, function(err){
      if(!err){
        res.send("successfully updated contact!")
      }
    }
  )
});

app.patch("/contacts/:contactName", function(req, res){           //update a feild of a contact
  Contact.update(
    {title:req.body.contactName},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated contact!")
      }else{
        res.send(err);
      }
    }
  );
});

app.delete("/contacts/:contactName", function(req, res){
  Contact.deleteOne(
    {name: req.params.contactName},
    function(err){
      if(!err){
        res.send("successfully deleted the contact!")
      }else{
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("server started on port 3000");
});
