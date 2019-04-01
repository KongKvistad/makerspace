let express = require("express");

const sanityClient = require('@sanity/client')

var request = require("request");


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
  projectId: 'tjpib6xg',
  dataset: 'blackbox',
  token: 'sk00stWCzAJPzpbwwAbz1MNMTpAdQXkbVs3JEI8HOxLkqAUi7DJTGIbcMLo99MJim5qa6HeNtY6dZz3AXieLGGmGjO8aDQ8x3ufBALceDbUeGmpIX4ZKy8GQ2beR95gbVsSIboDzdmz989a2V0avrU8xekChyUGsO8qVvcfFRUkvaga7CuaA',
  useCdn: false // `false` if you want to ensure fresh data
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
        { email: email,
          name: 'eirik.kvistad@gmail.com' },
          replyTo: { email: 'designverkstedet.ntnu@gmail.com', name: 'Designverk' },
          subject: 'Sikkerhetskode, designverkstedet',
          to: [ { email: email, name: navn } ],
          textContent: `din sikkerhetskode er: ${key}` },
          json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    })



  }

  
})


app.listen(port, () => {
	console.log('Server running on' + port)
})
