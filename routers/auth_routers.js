const express = require("express");
const authController = require("../controller/auth_controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/", authController.test);
router.post("/update/:id", verifyToken, authController.updateUser);
router.delete("/delete/:id", verifyToken, authController.deleteUser);
router.get("/signOut", authController.signOut);

module.exports = router;
