const express = require("express");
const app = express();
const https = require("https");

const blogs = require(__dirname + "/blogs.js");
const contents = require(__dirname + "/contents.js");

const posts = [];

app.set('view engine', 'ejs');
//for body parser from req
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("home", { home: contents.homeStartingContent, posts: posts });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutcontent: contents.aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const compose = {
    title: req.body.title,
    post: req.body.post
  };

  posts.push(compose);
  res.redirect('/');
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactcontent: contents.contactContent });
});

app.get("/post", (req, res) => {
  res.render("post");
});

app.get("/post/:dynamicpost", (req, res) => {
  const parameter = req.params.dynamicpost.replace("-", " ").toUpperCase();

  posts.forEach((post) => {
    const title = post.title.toUpperCase();
    if (title === parameter) {
      res.render("post", { post: post });
    }
  });

});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server set up");
});