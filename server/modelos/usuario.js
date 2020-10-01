const mongoose = require("mongoose");
// instalar npm i mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido",
};

let Schema = mongoose.Schema; //esquema

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    require: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    unique: true, //para validar que no haya dos email iguales
    require: [true, "El correo es obligatorio"],
  },
  password: {
    type: String,
    require: [true, "la contraseña es obligatoria"],
  },
  img: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//Para que no devuelva la contraseña
usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};
//---------------------------------

//agrego el plugin para validar campos, en este caso solo el mail
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("Usuario", usuarioSchema);
