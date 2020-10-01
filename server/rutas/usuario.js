const express = require("express");
//Para encriptar la contraseña-----
const bcrypt = require("bcrypt");
//----------------------------------
//Underscore js para validar en PUT
const _ = require("underscore");
//------------------------------------
const Usuario = require("../modelos/usuario"); //traigo el modelo para la base de datos de usuario

const app = express();

//Peticion GET-------------------------------------
app.get("/usuario", function (req, res) {
  let desde = req.query.desde || 0; //para manejar desde que usuario voy a mostrar
  desde = Number(desde); //convierto el valor a número

  let limite = req.query.limite || 5; //Para definir el limite de registros por pagina
  limite = Number(limite); //convierto el valor en numero

  Usuario.find({ estado: true }, "nombre email role estado img") //puedo poner una condicion de busqueda
    .skip(desde) //envio desde que usuario mostrara
    .limit(limite) //cuantos registros mostrará
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      //Para traer la data y ademas cuantos registros activos en total hay
      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });

  // res.json("Get Usuario LOCAL");
});
//---------------------------------------------------

//----POST-----------------------------------------
app.post("/usuario", function (req, res) {
  let body = req.body;

  //variable usuario es una instancia de Usuario (modelo DB)
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    //encriptando contraseña--------------------
    password: bcrypt.hashSync(body.password, 10),
    //---------------------------------------------
    role: body.role,
  });

  //Para guardar datos en DB
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    //forma de no mostrar el hash de la contraseña
    // usuarioDB.password = null;
    //-----------------------------------------
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});
//-------------------------------------------------

//----------PUT----------------------------
app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  //utilizo underscore.js para determinar que campos se pueden modificar
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  //Busco el id en la BD y actualizo los datos con el body
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

//--------------------------------------------

//------Delete----------------------------------

app.delete("/usuario/:id", function (req, res) {
  // res.json("Delete Usuario");

  let id = req.params.id;

  //Borrar el registro solo cambiando el estado a falso
  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }, //muestre el registro nuevo actualizado
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no encontrado",
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );

  //Para borrar el registro físicamente de la BD-------------
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //     });
  //   }
  //   if (!usuarioBorrado) {
  //     return res.status(400).json({
  //       ok: false,
  //       err: {
  //         message: "Usuario no encontrado",
  //       },
  //     });
  //   }
  //   res.json({
  //     ok: true,
  //     usuario: usuarioBorrado,
  //   });
  // });
});

module.exports = app;
