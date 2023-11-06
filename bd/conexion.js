var admin = require("firebase-admin");
var keys = require("../keys.json")

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db = admin.firestore();
var conexionUsuarios = db.collection("usuarios");

module.exports={
    conexionUsuarios,
};