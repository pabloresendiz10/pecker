var conexion = require("./conexion").conexionUsuarios;
const { generarPassword, validarPassword } = require("../middlewares/password");
var Usuario = require("../modelos/Usuario");

async function mostrarUsuarios() {
    var users=[];
    try{
        var usuarios = await conexion.get();
        usuarios.forEach((usuario)=>{
            //console.log(usuario.data());
            var usuario1 = new Usuario(usuario.id, usuario.data());
            //console.log(usuario1.obtenerUsuario);
            if (usuario1.bandera==0) {
                //console.log(usuario1.usuario="fghghgg");
                users.push(usuario1.obtenerUsuario);
            }
        });
    }
    catch(err){
        console.log("Error al obtener los usuarios de firebase "+err);
        //users.push(null);
    }
    return users;
}

async function buscarporID(id) {
    var user;
    try {
        var usuariobd = await conexion.doc(id).get();
        var usuarioObjeto = new Usuario(usuariobd.id, usuariobd.data());
        if (usuarioObjeto.bandera==0) {
            user = usuarioObjeto.obtenerUsuario;
        }
    }
    catch (err) {
        console.log("Error al buscar el usuario "+err);
        user=null;
    }
    return user;
}

async function modificarUsuario(datos) {
    var user = await buscarporID(datos.id);
    var error = 1;
    if (user!=undefined) {
        if (datos.password=="") {
            datos.password=user.password;
            datos.salt=user.salt;
        } else {
            var {salt,hash} = generarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var usuario = new Usuario(datos.id, datos);
        if (usuario.bandera==0) {
            try {
                await conexion.doc(usuario.id).set(usuario.obtenerUsuario);
                console.log("Usuario actualizado correctamente");
                error = 0;
            }
            catch (err) {
                console.log("Error al modificar el usuario "+err);
            }
        }
        else {
            console.log("Los datos no son correctos");
        }
    }
    return error;
}

async function borrarUsuario(id) {
    var error = 1;
    var user = await buscarporID(id);
    if (user!=undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Usuario borrado correctamente");
            error = 0;
        }
        catch (err) {
            console.log("Error al borrar el usuario "+err);    
        }
    }
    return error;
}

async function nuevoUsuario(datos) {
    var {salt, hash} = generarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false;
    var usuario = new Usuario(null, datos);
    var error=1;
    if (usuario.bandera==0) {
        try {
            await conexion.doc().set(usuario.obtenerUsuario);
            console.log("Usuario registrado correctamente");
            error = 0;
        }
        catch (err) {
            console.log("Error al registrar al usuario "+err);
        }
    }
    return error;
}

async function login(datos) {
    var user=undefined;
    var usuarioObjeto;
    try {
        var usuariosbd = await conexion.where('usuario','==',datos.usuario).get();
        if (usuariosbd.docs.length==0) {
            return undefined;
        }
        usuariosbd.docs.filter((doc)=>{
            var validar=validarPassword(datos.password,doc.data().password,doc.data().salt);
            if (validar) {
                usuarioObjeto = new Usuario(doc.id, doc.data());
                if (usuarioObjeto.bandera==0) {
                    user = usuarioObjeto.obtenerUsuario;
                }
            } else {
                return undefined;
            }
        });
    }
    catch (err) {
        console.log("Error al iniciar sesión "+err);
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    buscarporID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario,
    login
}