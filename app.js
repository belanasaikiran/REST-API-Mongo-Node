//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

// TODO

// routes

// ############################# Request Targeting All Articles #######################

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      console.log(foundArticles);

      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("successfully added new entry.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully Deleted All Articles");
      } else res.send(err);
    });
  });

// ############################# Request Targeting a Specific Article #######################

// we use params passed from URL

//  Eg: req.params.articleTitle = "Jack Boreau"

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching title was found");
        }
      }
    );
  })

  .put(function (req, res) {
    // NOTE: Put update the entire object even when passed a single field, it replaces the entire object by updating the field passed and applies null to the non mentioned values. - not recommended if you have more than one field in your object
    Article.findOneAndUpdate(
      // Conditions
      {
        title: req.params.articleTitle,
      },
      {
        title: req.body.title,
        content: req.body.content,
      },
      // Overwrite MongoDB data
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated Article");
        } else {
          res.send("Something went wrong!");
        }
      }
    );
  })

  //  TO update a specific field,we use 'PATCH'
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      {
        title: req.params.articleTitle,
      },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("successfully update the article");
        } else {
          res.send(err);
        }
      }
    );
  })


//  Delete a specific article matching the article title
.delete(function(req, res){
  Article.deleteOne(
    {
      title: req.params.articleTitle
    },
    function(err){
      if(!err){
        res.send(`Successfully deleted ${req.params.articleTitle}`)
      }else{
        res.send(err)
      }
    }
  )
})


// ################ Traditional Way
// GET
// app.get("/articles", );

// // POST

// app.post("/articles", );

// // DELETE
// app.delete("/articles", )

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
