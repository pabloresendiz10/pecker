var conexion = require("./conexion").conexionProductos;
var Producto = require("../modelos/Producto");

async function mostrarProductos() {
    var products=[];
    try{
        var productos = await conexion.get();
        productos.forEach((producto)=>{
            var producto1 = new Producto(producto.id, producto.data());
            if (producto1.bandera==0) {
                products.push(producto1.obtenerProducto);
            }
        });
    }
    catch(err){
        console.log("Error al obtener los productos de firebase "+err);
    }
    return products;
}

async function buscarporID(id) {
    var product;
    try {
        var productobd = await conexion.doc(id).get();
        var productoObjeto = new Producto(productobd.id, productobd.data());
        if (productoObjeto.bandera==0) {
            product = productoObjeto.obtenerProducto;
        }
    }
    catch (err) {
        console.log("Error al buscar el producto "+err);
        product=null;
    }
    return product;
}

async function nuevoProducto(datos) {
    var producto = new Producto(null, datos);
    var error=1;
    if (producto.bandera==0) {
        try {
            await conexion.doc().set(producto.obtenerProducto);
            console.log("Producto registrado correctamente");
            error = 0;
        }
        catch (err) {
            console.log("Error al registrar el producto "+err);
        }
    }
    return error;
}

async function modificarProducto(datos) {
    var product = await buscarporID(datos.id);
    var error = 1;
    if (product!=undefined) {
        var producto = new Producto(datos.id, datos);
        if (producto.bandera==0) {
            try {
                await conexion.doc(producto.id).set(producto.obtenerProducto);
                console.log("Producto actualizado correctamente");
                error = 0;
            }
            catch (err) {
                console.log("Error al modificar el producto "+err);
            }
        }
        else {
            console.log("Los datos no son correctos");
        }
    }
    return error;
}

async function borrarProducto(id) {
    var error = 1;
    var product = await buscarporID(id);
    if (product!=undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Producto borrado correctamente");
            error = 0;
        }
        catch (err) {
            console.log("Error al borrar el producto "+err);    
        }
    }
    return error;
}

module.exports={
    mostrarProductos,
    buscarporID,
    nuevoProducto,
    modificarProducto,
    borrarProducto
}