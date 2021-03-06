var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var config ={
  user: 'bbhargavi1012',
  database: 'bbhargavi1012',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.JSON());

var articles= { 
'article-one': {
    title:'Article-One Bindu',
    heading:'Article One',
    date:'21st august 2017',
    content: `<p>
                This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.
            </p>
            <p>
                This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.
            </p>
            <p>
                This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.This is the content of my first article one.
            </p>`
},
'article-two': {
    title:'Article-Two Bindu',
    heading:'Article Two',
    date:'22st august 2017',
    content: `<p>
                This is the content of my second article.This is the content of my second article.This is the content of my second article one.This is the content of my first article one.
            </p>
            <p>
                This is the content of my second article one.This is the content of my second article .This is the content of my second article .
            </p>`
},
'article-three': {
    title:'Article-Three Bindu',
    heading:'Article Three',
    date:'23st august 2017',
    content: `<p>
                This is the content of my third article.This is the content of my third article.This is the content of my third article .This is the content of my third article.
            </p>
            <p>
                This is the content of my third article .This is the content of my third article .This is the content of my third article .
            </p>`
}
};

function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
var htmlTemplate=`
<html>
    <head>
        <title> ${title}</title>
        <meta name="viewport" content="width=device-width" initial-scale=1 />
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
        <body>
        <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>${heading}</h3>
            <div>${date.toDateString()}</div>
            <div> ${content}</div>
        </div>
        </body>
</html>
`;
return htmlTemplate;
}
app.get('/favicon.ico', function (req, res) {

  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));

});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
 //how do we create hash
 var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
 return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res) {
   var hashedString = hash(req.params.input, 'This is some random string');
   res.send(hashedString);
});
app.post('/create-user', function (req, res) {
   //username
   //password
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)', [username,dbString], function (err, result) {
      if(err) {
          res.status(500).send(err.toString());
      } else{
          res.send('User successfully created : ' + username);
      }
   });
});
app.post('/login', function (req, res) {
    var username = req.body.username;
   var password = req.body.password;
         pool.query('SELECT * FROM "user" username = $1', [username], function (err, result) {
      if(err) {
          res.status(500).send(err.toString());
      } else{
          if(result.rows.lenght === 0){
              res.status(403).send('username/password is invalid');
          } else {
          res.send('User successfully created : ' + username);    
          }
          
      }
   });
});
var pool = new Pool(config);
app.get('/test-db', function (req, res) {
   //make a select request
   //make a response with the results
   pool.query('SELECT * FROM test', function(err, result){
      if(err) {
          res.status(500).send(err.toString());
      } else{
          res.send(JSON.stringify(result.rows));
      }
   });
});
    
var counter=0;
app.get('/counter', function(req,res) {
    counter=counter+1;
    res.send(counter.toString());
});
var names=[];
app.get('/submit-name', function (req, res){ // URL ://submit-name?name=xxxxx
   //get the name from the request
   var name=req.query.name;
   names.push(name);
   //JSON:javascript notation
   res.send(JSON.stringify(names));
});
app.get('/articles/:articleName', function (req,res) {
    //it means articleName==article-one
    //articles[articleName]={} content object for article one
    //SELECT * FROM article WHERE title='article-one'
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
      if(err) {
          res.status(500).send(err.toString());
      } else {
          if(result.rows.lenght ===0) {
              res.status(404).send('article not found');
          } else {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      }
    });
    // res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
