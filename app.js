const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const md = require('markdown-it')();
const articleRouter = require("./article");
const testingRouter = require("./testing");
const mongoose = require("mongoose");
require('dotenv').config();
const Article = require("./articleSchema");
const methodOverride = require('method-override')



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use("/articles", articleRouter);
app.use("/testing", testingRouter);
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGODB);

app.get("/", async (req, res) => {

let articles = await Article.find().sort({createdAt:"desc"})

    res.render("article/index", {articles: articles});
});

app.post("/", function(req, res){
//console.log(req.body.input);
var result = md.render(req.body.input);
res.render("display", {doc:result});
});



app.post("/display", function(req, res){
    res.render("display", {doc: req.body.textAreaDoc});
});




app.listen(3000, function(){
    console.log("Listening on port 3000");
});
