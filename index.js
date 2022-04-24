/* api init  */
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

require("dotenv").config();


/* middleware */
app.use(cors())
app.use(express.json())


/* temporary api url */
app.get("/", (req, res) => {
    res.send(`This is server of EMA-JHON SERVER`)
})


const data = [
    {
        name: 'ashik',
        role: 'jr developer'
    },
    {
        name: 'Mahmud',
        role: 'jr developer'
    },
    {
        name: 'Abir',
        role: 'jr developer'
    }
]

async function run(){
    
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.fykr4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try{
        await client.connect();
        const productsCollection = client.db("ema-jhon").collection("products")

       /*  GET ALL THE DATA FROM MONGODB */
       app.get("/products", async(req, res) =>{
           const page = parseInt(req.query.page);
           const size = parseInt(req.query.size) || 12;
           const query = {};
           const result = await productsCollection.find(query);
           let productData;
           if(page || size){
            productData = await result.skip(page*size).limit(size).toArray();
           }else{
            productData = await result.toArray();
           }
           
           res.send(productData)
       })

       /* GET TOTAL DATA COUNT  */
       app.get("/productsCount", async(req, res) =>{
           const count = await productsCollection.estimatedDocumentCount();
           res.send({count})
       })

       /* FILTER DATA USING ID */
       app.post("/products", async(req, res)=>{
           const keysArr = req.body;
           const productKeys = keysArr.map(key => ObjectId(key))
           const query = {_id: {$in: productKeys}}
           const cursor = await productsCollection.find(query);
           const cartProduct = await cursor.toArray();
           res.send(cartProduct)
       })


       



    }
    finally{}
};
run().catch(console.dir)


app.get("/data", (req, res)=> {
    res.send(data)
})
/* listen */
app.listen(port, ()=>{
 console.log(`SERVER RUNNING ON ${port}`);
})