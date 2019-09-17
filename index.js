let express = require("express");

const sanityClient = require('@sanity/client')

var request = require("request");

var path = require('path');


const port = process.env.PORT || 3000;

let app = express();


const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const client = sanityClient({
  projectId: 'fsygm6xc',
    dataset: 'dummydata',
    token: "skYyKICuVUb7uDUk4TEhhe1XQAbrul1YXrdQ5W6ZmFGxFs6LpGkCxhvgIMG5mpKqM1fXwNxcqgWC1gABvzVtqAE6yItn2sXaGkKgG1yW1q9Fi0Bum5KOl9T5vdUymHc1NKOdNLB88Ep0uPt0yuqxRw97ihgC7XCiBaqXoCzQS8ImyJGaEGvs",
    useCdn: false
})



function genKey(length){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}




app.post('/gencode', function (req, res, ) {
  
  let studentID = req.body.json
  const query = '*[_type == "author" && _id == $student ] {"id": _id, "email": email, "name": name}'
  const params = {student: studentID}


  client.fetch(query, params).then(res => {
    res.forEach(response => {
      console.log(`${response.id}, ${response.email}, ${response.name}`)
      sendMail(response.email, response.name, response.id)
    })
  })
  

  

  function sendMail(email, navn, id) { 
    let key = genKey(5)

    client
      .patch(id) // Document ID to patch
      .set({secKey: key}) //set the field in question
      .commit() // Perform the patch and return a promise
      .then(updatedkey => {
        console.log('Hurray, generated key is:'+key)
        console.log(updatedkey)
      })
      .catch(err => {
        console.error('Oh no, the update failed: ', err.message)
      })
    
    var options = { method: 'POST',
    url: 'https://api.sendinblue.com/v3/smtp/email' ,
    headers: {
      'api-key': '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'
    },
    body: 
    { tags: [ 'supertest' ],
      sender: 
        { email: 'designverkstedet.ntnu@gmail.com',
          name: 'NTNU Makerspace' },
          replyTo: { email: 'designverkstedet.ntnu@gmail.com', name: 'NTNU Makerspace' },
          subject: 'Sikkerhetskode, designverkstedet',
          to: [ { email: email, name: navn } ],
          textContent: `din sikkerhetskode er: ${key}` },
          json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.end(JSON.stringify({result: response}))
    })



  }

  
})

app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(express.static('staticPages'));

app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, '/staticPages', 'index.html'));
});

app.get('/getpage/:slug', function (req, res ) {

  var param = "'" +  req.params.slug + "'";
  
  const query2 = `*[_type == 'post' && slug.current == ${param}]{"url": mainImage[0...4].asset->url,"alt": mainImage[0...4].alt, "title": title, "dateFrom": from, "time": tid, "author": author -> name, "slug": slug, "course": course, "tech": tech, "cat": categories[0] -> title, "body": body}`
  client
   .fetch(query2)
   .then(response => {
     console.log(response)
    res.render("projectpage", {result : response});
    })
})

app.get('/getEvent/:id', function (req, res ) {

  var param = "'" +  req.params.id + "'";
  
  const query3 = `*[_type == 'test' && _id == ${param}]`
  client
   .fetch(query3)
   .then(response => {
     console.log(response)
    res.render("eventpage", {result : response});
    })
})


app.listen(port, () => {
	console.log('Server running on' + port)
})
