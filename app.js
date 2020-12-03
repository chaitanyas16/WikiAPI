const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true,useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title : String,
  content : String

});

const Article = mongoose.model('Article',articleSchema);

app.route('/articles')

.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(err) {
      console.log(err);
    } else {
      res.send(foundArticles);
    }
  });
})
.post(function(req,res){

  const article = new Article({
    title : req.body.title,
    content : req.body.content
  });

  article.save(function(err){
    if (!err) {
      res.send('Successful added New Article')
    } else
    {
      res.send(err);
    }
  })
})
.delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all articles")
      }

      else
      {
        res.send(err);
      }
    });
  });

  app.route('/articles/:articleTitle')

  .get(function(req,res){
    Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      } else
      {
        res.send("No articles matching that title was found!");
      }
    });
  })

  .put(function(req,res){
    Article.update(
      {title : req.params.articleTitle},
      {title : req.body.title, content : req.body.content},
      {overwrite : true},
      function(err){
        if(!err){
          res.send('Successful update of article');
        } else {
          res.send(err);
        }

      })
  })

  .patch(function(req,res){
    Article.update(
      {title : req.params.articleTitle},
      { $set : req.body},
    function(err){
      if(!err){
        res.send('Successful update of article');
      } else {
        res.send(err);
      }
    }
  )
})

.delete(function(req,res){
  Article.deleteOne(
    {title : req.params.articleTitle},
    function(err){
      if(!err){
        res.send('Successfil deletion of article');
      }
        else {
          res.send(err);
        }
      }
    )
});



app.listen(3000, function() {
  console.log("Server started has started Successfully");
});
