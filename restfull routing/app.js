var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");
var expresssanitizer = require("express-sanitizer");
app = express();
mongoose.connect("mongodb://localhost/restfulapp",{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer());
var blogschema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var blog = mongoose.model("blog",blogschema);


app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs});	
		}
	});
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs",function(req,res){
	
	blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");	
		}
	})
});
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.render("/blogs");
		}else{
			res.render("show",{blog:foundblog});	
		}
	});
});
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.render("/blogs");
		}else{
			res.render("edit",{blog:foundblog});	
		}
	});
	
});
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);	
		}
	});
});
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});


app.listen(3000,function(){
	console.log("server is running");
});