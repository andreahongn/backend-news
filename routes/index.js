const router = require("express").Router();

const routesU = require("./userRoutes");
const routesN = require("./newsRoutes");

router.use("/newsRou", routesN);
router.use("/userRou", routesU);

module.exports = router;
