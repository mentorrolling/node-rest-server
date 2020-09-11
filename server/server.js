require("./config/config"); //importo las configuraciones
const express = require("express");
const bodyParser = require("body-parser"); //manejador de respuesta del body
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/usuario", function (req, res) {
  res.json("Get Usuario");
});

app.post("/usuario", function (req, res) {
  let body = req.body;

  if (body.nombre) {
    res.json({
      persona: body,
    });
  } else {
    res.status(400).json({
      ok: false,
      mensaje: "El nombre es necesario",
    });
  }
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  res.json({
    id,
  });
});

app.delete("/usuario", function (req, res) {
  res.json("Delete Usuario");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto", process.env.PORT);
});
