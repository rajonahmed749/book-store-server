const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
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
  const orderCollection = client.db("theBookStore").collection("orders");

  // get all books
  app.get('/allBooks', (req, res) => {
    bookCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  // add book one by one
  app.post('/addBook', (req, res) => {
    const newBook = req.body;    
    bookCollection.insertOne(newBook)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  });


  // checkout theBookStore
    app.get("/book/:id", (req, res) => {    
    bookCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
      // console.log("this is documents",documents);

    })
  })

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/allOrder', (req, res) => {
    orderCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })


  // delete book
  app.delete("/delete/:id", (req, res) => {
    bookCollection.deleteOne({ _id: ObjectId(req.params.id)})
    .then(result => console.log(result.deletedCount > 0))
  })





});



app.listen(port)