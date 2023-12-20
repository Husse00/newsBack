const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
const db = "newsletter";
const collectionName = "users";


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

async function GetSubscription(userId)
{
    let subscription = null;

    try {
        await client.connect();

        let database = client.db(db);
        let collection = database.collection(collectionName);

        // subscription = (await collection.findOne({_id: new ObjectId(userId)})).subscribe;
        subscription = (await collection.findOne({_id: new ObjectId(userId)})).subscribe;


    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    return subscription;
}

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