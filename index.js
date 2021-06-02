const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqa8e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send("This is first server after a long time")
  console.log("database connected")
})


client.connect(err => {
  const bookCollection = client.db("theBookStore").collection("books");

  app.get('/allBooks', (req, res) => {
    bookCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })


  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log("new books", newBook);
    bookCollection.insertOne(newBook)
    .then(result => {
      console.log("insert one", result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
});



app.listen(port)