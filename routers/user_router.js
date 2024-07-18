const express = require("express");
const userController = require("../controller/user_controller");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google", userController.google);

module.exports = router;
