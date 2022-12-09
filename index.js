const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()

// midleWare 
app.use(cors())
app.use(express.json())


// book address api 
// userName : BookingAddress
// userName : U6gsnVfzy61gX30a



const uri = "mongodb+srv://BookingAddress:U6gsnVfzy61gX30a@cluster0.w4v9v80.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    const bookingCollection = client.db('bookingAddress').collection('allBook')
    const userCollection = client.db('allUser').collection('user')
    // post
    app.post('/booking', async (req, res) => {
        const user = req.body
        console.log(user)
        const result = await bookingCollection.insertOne(user)
        res.send(result)
    })

    // get 
    app.get('/booking', async (req, res) => {
        const query = {}
        const result = await bookingCollection.find(query).toArray()
        res.send(result)
    })


    // delete 
    app.delete('/booking/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await bookingCollection.deleteOne(query)
        res.send(result)
    })

    // user api get///////////////

    app.post('/alluser', async (req, res) => {
        const user = req.body
        console.log(user)
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    // user get 
    app.get('/users', async (req, res) => {
        const query = {}
        const result = await userCollection.find(query).toArray()
        res.send(result)
    })

    // query by eamil 
    app.get('/user', async (req, res) => {
        const email = req.query.email
        const query = { email: email }
        console.log(email)
        const result = await userCollection.find(query).toArray()
        res.send(result)
    })
}

run().catch(e => console.log(e))


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server port is ${port}`)
})