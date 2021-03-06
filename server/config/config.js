//Puerto

process.env.PORT = process.env.PORT || 3000;

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//==========================
// Vencimiento del Token
//==========================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==========================
// Base de datos
//==========================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

//==========================
// Base de datos
//==========================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
// Autenticación con Google
//==========================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "877760850378-h4k3jl6alup7n0t4nsp7ijagdo2sa20i.apps.googleusercontent.com";
