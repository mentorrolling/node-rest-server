//para verificacion de token y validacion
const jwt = require("jsonwebtoken");

//======================
// Verificar Token
//======================

let verificaToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token incorrecto",
        },
      });
    }

    req.usuario = decoded.usuario;

    next(); //para que se ejecute lo que sigue de la validacion en el get de usuario
  });

  //   res.json({
  //     token: token,
  //   });
};

//======================
// Verificar Admin_role
//======================
let verificaAdminRole = (req, res, next) => {
  //al validarse el token ya tengo estos datos
  let usuario = req.usuario;
  if (usuario.role === "USER_ROLE") {
    return res.status(401).json({
      ok: false,
      err: {
        message: "No tiene permisos de administrador",
      },
    });
  } else {
    next();
  }
};

module.exports = {
  verificaToken,
  verificaAdminRole,
};
