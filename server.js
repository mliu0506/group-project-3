const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");

const PORT = process.env.port || 3000;
//Define middleWare
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connecting to heroku
if(process.env.NODE_ENV ==="production"){
    app.use(express.static("client/build"));
}
//Connect to Mongo db specifically to mlab
mongoose.connect(process.env.MONGODB_URI || "mongodb://anil093:anil1234@ds257732.mlab.com:57732/share_me")

//Connect api, views route
app.use(routes);

//Send every other request to React app
//Define any API routes before this run
app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "./client/build/index.html"));
})


//Connecting to server 3000
app.listen(PORT, ()=>{
    console.log(`Server is listening to ${PORT}`);
})