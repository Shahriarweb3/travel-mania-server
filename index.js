const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayoaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_plans');
        const packageCollection = database.collection('tourist_spots');
        const ordersCollection = database.collection('orders')



        // GET specific Orders API by email
        app.get('/orders', async (req, res) => {
            let query = {}
            const email = req.query.email;
            if (email) {
                query = {
                    buyerEmail
                        : email
                }
            }

            const cursor = await ordersCollection.find(query);
            const specificOrder = await cursor.toArray();
            res.send(specificOrder);
        })

        // GET API
        app.get('/plans', async (req, res) => {
            const cursor = packageCollection.find({});
            const tourPlans = await cursor.toArray();
            res.json(tourPlans);
        });

        // UPDATE order API
        app.put('/orders/:id', async (req, res) => {
            const status = req.body;
            const filter = { orderStatus: status.orderStatus };
            const updateDoc = { $set: { orderStatus: 'Approved' } };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })


        // GET Single Service
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const tourPlan = await packageCollection.findOne(query);
            res.json(tourPlan);
        })

        // POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });
        // POST add package API
        app.post('/plans', async (req, res) => {
            const plans = req.body;
            const result = await packageCollection.insertOne(plans);
            console.log(result);
            res.json(result)
        });



        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleted')
            res.json(result);

        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Travel Mania Server');
});

app.listen(port, () => {
    console.log('Running Travel Mania Server on port', port);
})

