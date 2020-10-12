//Entes archivo manejo las configuraciones globales

require("./config/config"); //importo las configuraciones
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const bodyParser = require("body-parser"); //manejador de respuesta del body
const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//traigo el archivo de las rutas globales
app.use(require("./rutas/index"));

//Para corregir todas las advertencias de obsolescencia
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

/* Reemplazar update()con updateOne(), updateMany()oreplaceOne()
Reemplazar remove()con deleteOne()o deleteMany().
Reemplazar count()con countDocuments(), a menos que desee
contar cuántos documentos hay en toda la colección(sin filtro)
  .En el último caso, utilice estimatedDocumentCount(). */

//Conectar con la BD
//mongoose.connect("mongodb://localhost:27017/cafe", (err, resp) => {
mongoose.connect(process.env.URLDB, (err, resp) => {
  if (err) throw err;

  console.log("Base de datos Online");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto", process.env.PORT);
});
