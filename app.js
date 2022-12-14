const express = require('express');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require('https');
const { execPath } = require('process');
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // creating an object storing the user data
    const listId = '175536b6c5'
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    // const jsonData = JSON.stringify(data);

    // const url = 'https://us21.api.mailchimp.com/3.0/lists/175536b6c5'
    // const options = {
    //     method: 'POST',
    //     auth: 'Sing:7899491c4bafa76b6aa9d8fc8fd85bcb-us21'
    // }
    
    // const request = https.request(url , options, function(response) {
    //     response.on('data', function(data) {
    //         console.log(JSON.parse(data));
    //     })
    // });

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });
        
        res.sendFile(__dirname + '/success.html');
               
        console.log(
          `Successfully added contact as an audience member. The contact's id is ${
            response.id
          }.`
        );
      }
      
    run().catch(e => res.sendFile(__dirname + '/failure.html'));
    console.log(res.statusCode)
});


app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port:3000')
});

mailchimp.setConfig({
  apiKey: "7899491c4bafa76b6aa9d8fc8fd85bcb-us21",
  server: "us21",
});



// API Key
// 7899491c4bafa76b6aa9d8fc8fd85bcb-us21

// Audience ID
// 175536b6c5