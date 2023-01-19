//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { encrypt, decrypt } = require("./crypto");

const serverKey = "us17";

const key = "ap1k3y";

const encrypted = encrypt(
    "939cb7db07948b00bcedd2e1b6da61e0-".concat(serverKey).toString()
);

mailchimp.setConfig({
    apiKey: decrypt(encrypted),
    server: serverKey
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


    const listId = "65cf3c39c3";
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
            if (error.status !== 200) {
                res.sendFile(__dirname + "/failure.html");
                console.log(error);
            }
        }

    }

    run();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


//dynamic port
app.listen(3000, function () {
    console.log("Server running on port 3000.");
});

