var express = require("express");
var path = require("path");
var cors = require("cors");
var session = require("cookie-session");
var usuariosRutas = require("./rutas/usuariosRutas");
var usuariosRutasApi = require("./rutas/usuariosRutasApi");

var app=express();
app.set("view engine", "ejs");
app.use(cors());
app.use(session({
    name:"session",
    keys:["kdwodhodeuhfufhiqhdipwq982e29"],
    maxAge:24*60*60*1000
}));
app.use(express.urlencoded({extended:true}));
app.use("/web",express.static(path.join(__dirname,"/web")));
app.use("/",express.static(path.join(__dirname,"/web")));
app.use("/", usuariosRutas);
app.use("/", usuariosRutasApi);

var port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});