const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uinjrty.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   

const database = client.db('brandDB')
const brandCollection = database.collection('brand')
const brandDetailsCollection = database.collection('brandDetails')
const cartCollection = database.collection("cart");
// add product
app.post('/brands', async(req, res)=>{
 const brand = req.body;
 console.log(brand)
 const result =await brandCollection.insertOne(brand)
 res.send(result)
})

// get api of brand card data for home page
app.get('/brands', async(req, res)=> {
  const cursor = brandCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})



//for 24 products
app.post('/brandDetails', async(req, res)=>{
  const brand = req.body;
  console.log(brand)
  const result =await brandDetailsCollection.insertOne(brand)
  res.send(result)
 })

 app.get('/brandDetails', async(req, res)=> {
  const cursor = brandDetailsCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/brandDetails/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await brandDetailsCollection.findOne(query)
  res.send(result)

})

//add to cart
app.post('/myCart', async(req, res)=>{
  const cart = req.body;
  console.log(cart)
  const result =await cartCollection.insertOne(cart)
  res.send(result)
 })


 app.get('/myCart', async(req, res)=> {
  const cursor = cartCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})


// app.delete("/myCart/:id", async (req, res) => {
//   const id = req.params.id
//   const query ={_id : new ObjectId(id)}
//   const result = await cartCollection.deleteOne(query)
//   res.send(result)
// });

app.delete("/myCart/:id", async (req, res) => {
   
  const id = req.params.id
  
  const query ={_id : id}
  const result = await cartCollection.deleteOne(query);
  res.send(result)
});

//update:
app.put('/brandDetails/:id', async(req, res)=> {
const id = req.params.id;
const newInfo = req.body;
const filter = { _id: new ObjectId(id) };
const options = { upsert: true };
const updateDoc = {
  $set: {
    name: newInfo.name,
    brand: newInfo.brand,
    type: newInfo.type, 
    price: newInfo.price, 
    rating: newInfo.rating, 
    photo: newInfo.photo
  }
}
const result = await brandDetailsCollection.updateOne(filter, updateDoc, options);
res.send(result)
})








    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);






app.get('/', (req, res)=>{
    res.send('hello worlds')
})


app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})