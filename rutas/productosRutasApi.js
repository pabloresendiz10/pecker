var ruta = require("express").Router();
var {subirArchivo} = require("../middlewares/middlewares");
const conexion = require("../bd/conexion");
var {mostrarProductos, nuevoProducto, modificarProducto, borrarProducto, buscarporID} = require("../bd/productosBD");

ruta.get("/api/mostrarproductos",async(req,res)=>{
    var productos = await mostrarProductos();
    if (productos.length==0) {
        res.status(400).json("No hay productos");
    } else {
        res.status(200).json(productos);
    }
});

ruta.post("/api/nuevoproducto",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    if (error==0) {
        res.status(200).json("Producto registrado correctamente");
    } else {
        res.status(400).json("Error al registrar el prodcuto");
    }
});

ruta.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var product = await buscarporID(req.params.id);
    if (product=="") {
        res.status(400).json("Status no encontrado");
    } else {
        res.status(200).json(product);
    }
});

ruta.post("/api/editarProducto",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await modificarProducto(req.body);
    if (error==0) {
        res.status(200).json("Producto actualizado correctamente");
    }
    else {
        res.status(400).json("Error al actualizar el producto");
    }
});

ruta.get("/api/borrarProducto/:id",async(req,res)=>{
    var error = await borrarProducto(req.params.id);
    if (error==0) {
        res.status(200).json("Producto borrado");
    }
    else {
        res.status(400).json("Error al borrar el producto");
    }
});

module.exports=ruta;