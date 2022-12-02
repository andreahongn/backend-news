const express = require("express");
const router = express.Router();

const routesU = require("./userRoutes");
const routesN = require("./newsRoutes");

router.use("/news", routesN);
router.use("/users", routesU);

module.exports = router;
