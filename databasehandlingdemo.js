const {MongoClient} = require('mongodb');
async function main(){
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        await createListing(client,{
            name: "Lovely Loft",
            summary: "A charming loft in Paris",
            bedrooms: 1,
            bathrooms: 1
        });
    }
    catch(e){console.error(e);}
    finally{await client.close();}
}
async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
async function createListing(client,newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
main().catch(console.error);