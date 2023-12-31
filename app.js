// import { mongodb } from "./mongodb.js";

const mongodb = require("./mongodb.js");

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Lösenord för admin route
const adminPassword = "admin";

app.use(express.json());

app.use(cors());

// Route för att logga in, email och lösenord krävs
app.post('/SignIn', async (req, res) => {

    let body = req.body;
    let email = body.email;
    let password = body.password;

    if (email != null && password != null)
    {
        let userId = await mongodb.SignIn(email, password)

        if (userId != null)
        {
            res.status(200);
            res.json({id: userId});
        } else {
            res.status(401);
            res.json();
        }
    }
    else
    {
        res.status(400);
        res.json();
    }
});

// Route för att signa upp, email och lösenord krävs
app.post('/SignUp', async (req, res) => {
    let body = req.body;
    let email = body.email;
    let password = body.password;

    if (email != null && email.length !== 0 && password != null && password.length !== 0)
    {
        let signupSuccess = await mongodb.SignUp(email, password);

        if (signupSuccess != null)
        {
            res.status(200);
            res.json();
        } else {
            res.status(401);
            res.json();
        }
    }
    else
    {
        res.status(400);
        res.json();
    }
});

app.post('/Subscribe', async (req, res) => {
    
    let body = req.body;
    let userId = body.userId;

    if (userId != null)
    {
        let success = await mongodb.SubscribeFlip(userId);

        if (success)
        {
            res.status(200);
            res.json();
        }
    }
    res.status(400);
    res.json();
});

app.get("/GetSubscription", async (req, res) => {
    
    let userId = req.query.userId;

    let subscription = await mongodb.GetSubscription(userId);

    if (subscription != null)
    {
        res.status(200);
        res.json(subscription);
    }
    else
    {
        res.status(400);
        res.json();   
    }
});

app.get("/GetUsers", async (req, res) => {

    let password = req.query.password;

    if (password == adminPassword)
    {
        let users = await mongodb.GetUsers();
        res.json(users);
        res.status(200);
    }
    else
    {
        res.status(400);
        res.json();
    }

});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
); 