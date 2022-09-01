require("dotenv").config();
const Op = require("sequelize").Op;
const path = require('path')
const {
  sequelize
} = require("./models");
const express = require("express");
const app = express();
HttpsProxyAgent = require("https-proxy-agent");
const proxy = process.env.http_proxy || "localhost:3000"; // HTTP/HTTPS proxy to connect to
const axios = require("axios");
var cors = require("cors");
// const cookieParser = require('cookie-parser');
var http = require("http").createServer(app);
// var io = require('socket.io')(http);
app.use(cors());
app.use(express.json());
// app.use(cookieParser());
const routing = require('./routing');
const mobileRoutes = require('./mobileRoutes/index')
// Setup static directory to serve
const publicDirectoryPath = path.join(__dirname, './uploads')
console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath))
console.log("static path",publicDirectoryPath)
app.use('/uploads', express.static(publicDirectoryPath));
// routing: app version v1 
app.use('/api/v1/', routing);
app.use('/api/v1/mobile', mobileRoutes)
const addproductController = require("./controllers/addproduct.controller");

// dummy
// app.get('/',(req,res) => res.send("Hello"));
// async function updateorder() {
//   addproductController.addorderbulk();
// }
// updateorder();
http.listen(process.env.PORT, async () => {
  try {
    //await sequelize.sync({force:true})
    await sequelize.authenticate();
    console.log("database connected");
    console.log(`server running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // console.log(`server running on port ${process.env.PORT}`);

    
  }

});
