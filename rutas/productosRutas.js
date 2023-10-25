var ruta = require("express").Router();
var {autorizado, admin} = require("../middlewares/password");
var {subirArchivo} = require("../middlewares/middlewares");
const conexion = require("../bd/conexion");
var {mostrarProductos, nuevoProducto, modificarProducto, borrarProducto, buscarporID} = require("../bd/productosBD");

ruta.get("/productos",async(req,res)=>{
    var productos = await mostrarProductos();
    //console.log(productos);
    res.render("productos/mostrar",{productos})
});

ruta.get("/nuevoproducto",admin, async(req,res)=>{
    res.render("productos/nuevo");
});

ruta.post("/nuevoproducto",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.filename;
    var error = await nuevoProducto(req.body);
    res.redirect("/productos");
});

ruta.get("/editarProducto/:id",async(req,res)=>{
    console.log(req.params.id);
    var product = await buscarporID(req.params.id);
    res.render("productos/modificar",{product})
    res.end();
});

ruta.post("/editarProducto",subirArchivo(),async(req,res)=>{
    if (req.file=null) {
        req.body.foto=req.file.filename;
    } else {
        req.body.foto=req.body.fotoAnterior;
    }
    var error = await modificarProducto(req.body);
    res.redirect("/productos");
});

ruta.get("/borrarProducto/:id",async(req,res)=>{
    try {
        await borrarProducto(req.params.id); 
        res.redirect("/productos");
    }
    catch (err) {
        console.log("Error al borrar el producto "+err);
    }
});

module.exports=ruta;