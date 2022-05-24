const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Article = require("./articleSchema");
const slugify = require("slugify");
const methodOverride = require('method-override');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride('_method'));

router.get("/", (req, res) => {
    res.send("Testing article router");
});

router.get("/new", (req, res) => {
    res.render("article/new", { article: new Article() });
});

router.post("/", async (req, res, next) => {

    // let article = new Article({
    //     title: req.body.title,
    //     description: req.body.description,
    //     markdown: req.body.markdown
    // })

    // await article.save(function (error, doc) {
    //     if (error) {
    //         res.render("article/new", { article: { title: article.title, description: article.description, markdown: article.markdown } })
    //     }
    //     else {
    //         res.redirect("/articles/" + article.id)
    //         console.log(article.id);
    //     }
    // });
    //}

    req.article = new Article();
    next()
}, saveArticleAndRedirect("new")


);

router.get("/:id", async function (req, res) {

    Article.findById(req.params.id, await function (error, result) {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            if (result === null) {
                res.redirect("/");
            } else {
                res.render("article/show", { article: result })
            }
        }
    });
})

router.get("/edit/:id", async function (req, res) {
    const editArticle = await Article.findById(req.params.id)
    res.render("article/edit", { article: editArticle })
})

router.post("/delete/:id", async function (req, res) {

    Article.deleteOne({ _id: req.params.id }, await function (error, deleteResult) {
        if (!error) {
            res.redirect("/");
        } else {
            console.log(error);
        }
    });

})

router.put("/:id", async function (req, res, next) {
    req.article = await Article.findById(req.params.id);
    req.newTest = "new Text sometext";
    next()
}, saveArticleAndRedirect("edit"));


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        console.log(req);
        //the same req, res from route.put but added req.article object

        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.createdAt = new Date()

        console.log("in function");
        console.log(article);

        await article.save(function (error, doc) {
            if (error) {
                res.render("article/${path}", { article: { title: article.title, description: article.description, markdown: article.markdown } })
            }
            else {
                res.redirect("/articles/" + article.id)
            }
        });
    }
}


module.exports = router