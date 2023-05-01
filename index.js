const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

require("./dataBase");
// middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// ENRUTAMIENTO

const routes = require("./routes");
app.use("/", routes);

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

app.listen(3001, () => {
  console.log("Server encendido en puerto 3001");
});
