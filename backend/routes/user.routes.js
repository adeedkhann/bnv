import express from "express";
import uploadProfileImage from "../middlewares/upload.middleware.js";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportUsers
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", uploadProfileImage, createUser);
router.get("/", getUsers);
router.get("/export", exportUsers);
router.get("/:id", getUserById);
router.patch("/:id", uploadProfileImage, updateUser);
router.delete("/:id", deleteUser);

export default router;
