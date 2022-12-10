const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
const app = express()

// midleWare 
app.use(cors())
app.use(express.json())
require('dotenv').config();

// book address api 

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.w4v9v80.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.send(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbiden access' })
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    const bookingCollection = client.db('bookingAddress').collection('allBook')
    const userCollection = client.db('allUser').collection('user')
    // post
    app.post('/booking', async (req, res) => {
        const user = req.body
        if (user) {
            const bookList = await bookingCollection.findOne({ bookName: user.bookName });
            if (user?.bookName == bookList?.bookName) {
                res.send({
                    result: 'Match'
                })
            }
            else {
                const result = await bookingCollection.insertOne(user);
                res.send(result)
            }
        }
    })

    // get book
    app.get('/booking', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }
        const result = await bookingCollection.find(query).toArray()
        res.send(result)
    })


    // delete book
    app.delete('/booking/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await bookingCollection.deleteOne(query)
        res.send(result)
    })


    // update book

    app.patch('/booking/:id', async (req, res) => {
        const id = req.params.id
        const data = req.body;
        const query = { _id: ObjectId(id) }
        const options = { upsert: true }
        const result = await bookingCollection.updateMany(query, { $set: data }, options)
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
    app.get('/jwt', async (req, res) => {
        const email = req.query.email;
        console.log(email)
        const query = { email: email }
        const user = await userCollection.findOne(query);
        console.log(user)
        if (user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            return res.send({ accessToken: token })
        }
        console.log(user)
        res.status(403).send({ accessToken: 'acces token' })
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