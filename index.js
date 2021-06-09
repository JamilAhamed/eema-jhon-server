const express = require('express')
const bodyParser =require('body-parser');
const cors =require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1a8q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()


app.use(bodyParser.json());
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("eemaJhonStoree").collection("products");
  const ordersCollection = client.db("eemaJhonStoree").collection("orders");
  console.log('database connected')

    app.post('/addProduct', (req, res) =>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result =>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })
       
    app.get('/products', (req, res) =>{
      productsCollection.find({})
      .toArray((err,documents) =>{
        res.send(documents);
      })
    })

    app.get('/products/:key', (req, res) =>{
      productsCollection.find({key: req.params.key})
      .toArray((err,documents) =>{
        res.send(documents[0]);
      })
    })

    app.post('/productsKeys',(req, res) =>{
      const productsKeys =req.body;
      productsCollection.find({key: { $in: productsKeys }})
      .toArray((err, documents) =>{
        res.send(documents);
      })
    })
    app.post('/addOrder', (req, res) =>{
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })



});


// console.log(process.env.DB_USER)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port)