var bodyparser=require("body-parser"),
	methodOverride=require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose=require("mongoose"),
	express=require("express"),
	app=express();

//APP.CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer()); 
//schema
//MONGOOSE/MODEL CONFIG
var blogschema=new mongoose.Schema({
	title:String, image:String, body:String ,created:{type:Date,default:Date.now}
	//for having a defualt image we can do is image:{type:String,Default:placeholder.jpg}
});

var blog=new mongoose.model("blog",blogschema);

//INDEX
app.get("/",function(req,res){
	res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err)
			console.log(err);
		else
			res.render("index",{blogs:blogs});
	})
})

//NEW
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//created

app.post("/blogs",function(req,res){
	//create blogs
	req.body.blog.body=req.sanitizer(req.body.blog.body);
	blog.create(req.body.blog,function(err,newdata){
		if(err)
			res.render("new");
		else
			//res.render("index",{blog:newdata})
			res.redirect("/blogs");
	})
})

//show
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,found){
		if(err)console.log(err);
		else
			res.render("show",{blog:found});
	})
})/*
app.post("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,found){
		if(err)console.log(err);
		else
			res.render("show",{blog:found});
	})
})*/

//edit Route
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundid){
		if(err){res.redirect("/blogs");}
		else{
			res.render("edit",{blog:foundid});
	}})
})
//update
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitizer(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err)res.redirect("/blogs");
		else res.redirect("/blogs/"+req.params.id);
	})
})

app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err) res.redirect("/blogs");
		else res.redirect("/blogs");
	})
})
// blog.create({
// 	title:"Test blog",image:"https://images.unsplash.com/photo-1591585701629-408feab119a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",body:"click from aeroplane"
// });

//RESTFUL ROUTES
//title

	
//})
//image
//body
//created


app.listen("3000",function(req,res){
	console.log("Restful blogging has started!!");
})