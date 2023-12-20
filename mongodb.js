const { MongoClient, ObjectId } = require("mongodb");

// mongodb connectionstring
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
// databas namn
const db = "newsletter";
// collection
const collectionName = "users";


// funktion för att skapa användare i databasen och returnera ID
async function SignUp(email, password)
{
    let id = null;
    try {
        await client.connect();

        let database = client.db(db);
        let collection = database.collection(collectionName);

        let data = {
            "email": email,
            "password": password,
            "subscribe": false
        };

        id = (await collection.insertOne(data)).insertedId;

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    return id;
}

// Funktion för att kolla ifall en användare finns i databasen och returnera dess ID ifall den finns
async function SignIn(email, password)
{
    let id = null;
    try {
        await client.connect();

        let database = client.db(db);

        let collection = database.collection(collectionName);

        let user = await collection.findOne({"email": email, "password": password});
  
        if (user != null)
        {
            id = user._id.toHexString();
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    return id;
}

// Funktion för att ändra en användares subscribed-flagga till tvärt om
async function SubscribeFlip(userId)
{
    let success = false;

    try {
        await client.connect();

        let database = client.db(db);
        let collection = database.collection(collectionName);

        let user = await collection.findOne({_id: new ObjectId(userId)});

        if (user != null)
        {
            let subscribeInvert = !user.subscribe;

            user.subscribe = subscribeInvert;

            await collection.updateOne({_id: new ObjectId(userId)}, {$set: {subscribe: subscribeInvert}});
            success = true;
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    return success;
}

// Funktion för att hämta användarens status för subscribe
async function GetSubscription(userId)
{
    let subscription = null;

    try {
        await client.connect();

        let database = client.db(db);
        let collection = database.collection(collectionName);

        subscription = (await collection.findOne({_id: new ObjectId(userId)})).subscribe;


    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    return subscription;
}

// Hämta alla användare
async function GetUsers()
{
    let users = null;

    try {
        await client.connect();

        let database = client.db(db);
        let collection = database.collection(collectionName);

        users = await collection.find().toArray();

    } catch (err) {
        console.error(err)
    } finally {
        await client.close();
    }

    return users;
}

module.exports = { SignIn, SignUp, SubscribeFlip, GetSubscription, GetUsers };