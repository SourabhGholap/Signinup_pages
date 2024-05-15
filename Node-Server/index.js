const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const {MongoClient} = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const server = express();
server.use(bodyParser.json());
server.use(cors());

let otp = 0;

async function createListing(client,newListing){
  const findname  = await client.db("employees").collection("Managers").findOne({name:newListing.name});
  const findmail  = await client.db("employees").collection("Managers").findOne({email:newListing.email});
  if(findname !== null){
    console.log("Username already exists");
    return "Username already exists";
  }
  if(findmail !== null){
    console.log("Email already exists");
    return "Email already exists";
  }
  const result = await client.db("employees").collection("Managers").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
  return "User added";
}

async function findlistings(client,query){
  const result = await client.db("employees").collection("Managers").findOne({name:query.name});
  console.log(result);
  return result;
}

server.post('/forgotpassword',async (req,res)=>
  {
    console.log(req.body);
    const client = new MongoClient(MONGODB_URI);
    try{
      await client.connect();
      const findmail  = await client.db("employees").collection("Managers").findOne({email:req.body.email});
      if(findmail !== null)
      {
        otp = Math.floor(1000 + Math.random() * 9000);
        console.log(otp);
        let testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'freda42@ethereal.email',
                pass: 'UmYcvCEyEPjScmZpxb'
            }
        });
        let msg = "username is '"+ findmail.name +"' and OTP FOR LOGIN IS : '" + otp + "'";
      
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <freda42@ethereal.email>', 
            to:req.body.email,
            subject: "Username and login OTP for demo app", 
            text: msg, 
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          res.json("OTP sent to your email");
       }
       else
       {
        res.json("Email not found. Please sign up with this email");
       }
    }
    catch(e){console.error(e);}
    finally{await client.close();}    
})

server.post('/verifyotp',async (req,res)=>
  {
    console.log(req.body.otp);
    if(req.body.otp == otp)
    {
      res.json("OTP verified");
    }
    else{
      res.json("Incorrect OTP");
    }
})

server.post('/adduser',async (req,res)=>{
  console.log(req.body);
  const client = new MongoClient(MONGODB_URI);
  try{
    await client.connect();
    const result = await createListing(client,req.body);
    res.json(result);
  }
  catch(e){console.error(e);}
  finally{await client.close();}
})

server.post('/finduser',async (req,res)=>{
  console.log(req.body);
  const client = new MongoClient(MONGODB_URI);
  try{
    await client.connect();
    const result = await findlistings(client,req.body);
    if(result === null){
      res.json("User not found");
    }
    else if(result.password === req.body.password)
    {
      res.json("login successful");
    }
    else{
      res.json("incorrect password");
    }
  }
  catch(e){console.error(e);
    res.json("unable to connect to mangodb");
  }
  finally{await client.close();}
})

server.post('/updatepassword',async (req,res)=>{
  console.log(req.body);
  const client = new MongoClient(MONGODB_URI);
  try{
    await client.connect();
    const result = await client.db("employees").collection("Managers").updateOne({email:req.body.email},{$set:{password:req.body.password}});
    res.json("Password updated");
  }
  catch(e){console.error(e);
    res.json("Password not updated");
  }
  finally{await client.close();}
})

server.get('/', (req, res) => {
  res.send('Hello, world!');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server is running...');
});