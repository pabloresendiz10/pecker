var ruta = require("express").Router();
var {subirArchivo} = require("../middlewares/middlewares");
const conexion = require("../bd/conexion");
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario} = require("../bd/usuariosBD");

ruta.get("/api/mostrarusuarios",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios);
    if (usuarios.length==0) {
        res.status(400).json("No hay usuarios");
    } else {
        res.status(200).json(usuarios);
    }
    
});

ruta.post("/api/nuevoUsuario",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario registrado correctamente");
    } else {
        res.status(400).json("Error al registrar al usuario");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id",async(req,res)=>{
    //console.log(req.params.id);
    var user = await buscarporID(req.params.id);
    if (user=="") {
        res.status(400).json("Status no encontrado");
    } else {
        res.status(200).json(user);
    }
    //res.render("usuarios/modificar",{user})
    //res.end();
});

ruta.post("/api/editarUsuario",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await modificarUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario actualizado correctamente");
    }
    else {
        res.status(400).json("Error al actualizar al usuario");
    }
});

ruta.get("/api/borrarUsuario/:id",async(req,res)=>{
    var error = await borrarUsuario(req.params.id);
    if (error==0) {
        res.status(200).json("Usuario borrado");
    }
    else {
        res.status(400).json("Error al borrar al usuario");
    }
});

module.exports=ruta;