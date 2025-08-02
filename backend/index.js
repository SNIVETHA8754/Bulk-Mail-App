const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
require('dotenv').config();



const app = express()

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
.then(function(){
    console.log("Connected to DB")
}).catch(function(){
    console.log("Failed to Connect")
})

const credentials = mongoose.model("credentials",{}, "bulkmail")

// ❗ Add this GET block below your model definition
app.get('/sendemail', (req, res) => {
  res.status(405).send('GET not supported. Use POST instead.');
});

app.post('/sendemail',  function (req, res) {
  // Handle incoming email data
  res.status(200).send('Email sent');

    let msg = req.body.msg
    let emailList = req.body.emailList

    credentials.find().then(function(data){
        



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    new Promise(async function(resolve, reject) {
        try {
            for (let i=0;i<emailList.length;i++) {
                await transporter.sendMail(
                    {
                        from:"nivetha8754@gmail.com",
                        to:emailList[i],
                        subject: "A Message from Bulk Mail App",
                        text: msg

                    }
                )
                console.log("Email sent to:"+emailList[i])                 
            }

            resolve("Success")
        }
        catch(error)
        {
            reject("Failed")
        }
})
.then(function(){
    res.send(true)
}).catch(function(){
    res.send(false)
})

 
    
}).catch(function(error){
    console.error("Error fetching credentials:", error);
    res.status(500).send("Error accessing credentials");
});



})


app.listen(3000, function() {
    console.log("Server Started....")
})