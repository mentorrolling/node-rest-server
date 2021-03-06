const express = require("express");
//Para encriptar la contraseña-----
const bcrypt = require("bcrypt");
//----------------------------------
const jwt = require("jsonwebtoken");

//Autenticación con Google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
//----------------------------------------------

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

//Configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  // console.log(payload.name);
  // console.log(payload.email);
  // console.log(payload.picture);
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}
// verify().catch(console.error);

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usar autenticación normal",
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          //   "este-es-el-seed-desarrollo",
          process.env.SEED,
          // { expiresIn: 60 * 60 * 24 * 30 }
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
      }
    } else {
      //si el usuario no existe en nuestra base de datos
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

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
    }
  });
});

module.exports = app;
