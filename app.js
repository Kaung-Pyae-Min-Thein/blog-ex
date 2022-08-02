const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ----------------DB setup
mongoose.connect("mongodb://localhost:27017/blogDB");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const blogModel = mongoose.model('post', blogSchema);

// -------------routes
app.get("/", (request, response) => {

  blogModel.find({}, (err, allblogs) => {
    // const blogs = allblogs;
    if (!err && allblogs.length > 0) {
      // console.log(allblogs);
      // console.log(typeof allblogs);
      response.render("home", { blogs: allblogs });
    }
    else {
      response.render("error");
    }
  });

});

app.get("/compose", (request, response) => {
  response.render("compose");
});

app.post("/compose", (request, response) => {
  const title = _.capitalize(request.body.title);
  const content = request.body.post;
  const compose = new blogModel({ title: title, content: content });

  compose.save()
    .then(() => response.redirect("/"))
    .catch((err) => response.redirect("/compose"));

});

app.get("/content/:contentId", (request, response) => {
  const contentId = _.capitalize(request.params.contentId);

  blogModel.findOne({ id: contentId }, (err, foundType) => {
    if (err) {
      console.log(err);
    }
    else {
      if (foundType) {

        response.render("content", { title: foundType.title, post: foundType.content });
      }
      else {
        response.redirect("/");
      }
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server set up at ${port}`);
});