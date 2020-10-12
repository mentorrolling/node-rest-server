const express = require("express");
//Para encriptar la contraseña-----
const bcrypt = require("bcrypt");
//----------------------------------
const jwt = require("jsonwebtoken");

const Usuario = require("../modelos/usuario"); //traigo el modelo para la base de datos de usuario

const app = express();

//para realizar el login
app.post("/login", (req, res) => {
  let body = req.body; //lo que viene como email y password

  //primero comparo si el email que se ingresó existe en la DB
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    //Si no se encuentra el email en la DB
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos",
        },
      });
    }

    //Si la contraseña ingresada no es la misma que la de la DB
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos",
        },
      });
    }

    //Si todo sale bien
    let token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      //   "este-es-el-seed-desarrollo",
      process.env.SEED,
      // { expiresIn: 60 * 60 * 24 * 30 }
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

module.exports = app;
