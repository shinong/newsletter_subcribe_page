const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data={
      members:[
          {
              email_address:email,
              status:"subscribed",
              merge_fields:{
                  FNAME:firstName,
                  LNAME:lastName
              }
          }
      ]  
    };

    const jasonData = JSON.stringify(data);

    const url = "https://us4.api.mailchimp.com/3.0/lists/41e4dbb91c ";
    const options = {
        method:"POST",
        auth:"user:6de631eca774cf0385db477d1dde99a9-us4"
    }

    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            const error_count = JSON.parse(data).error_count;
            // console.log(error_count);
            if (response.statusCode===200 && error_count ===0){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
        });
        
    });
    request.write(jasonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT||3000,function(){
    console.log("server is running on port 3000");
    
});

// apiKey
// 6de631eca774cf0385db477d1dde99a9-us4

// listID 
// 41e4dbb91c