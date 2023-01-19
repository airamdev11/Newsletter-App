//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: "5c12886e846d95822154b904c346f551-us17",
    server: "us17"
});


const app = express();

//css references
app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
/*
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/" + creatingList.Id;

    const options = {
        method: "POST",
        auth: "airamDev11:5c12886e846d95822154b904c346f551-us17"
    }


    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();*/


    const listId = "3bfdf29636";
    const userData = {
        firstName: fName,
        lastName: lName,
        email: email,
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: userData.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: userData.firstName,
                    LNAME: userData.lastName
                }
            });
    
            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );
            
            res.sendFile(__dirname + "/success.html");

        } catch (error) {
            if(error.status===400){
                res.sendFile(__dirname+"/failure.html");
            }
        }
        
    }
    
    run();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


//dynamic port
app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on port 3000.");
});

//Api Key: 5c12886e846d95822154b904c346f551-us17
//List Id: 3bfdf29636