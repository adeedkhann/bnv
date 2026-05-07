import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import json2csv from "json2csv";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Parser } = json2csv;

const buildProfileImageUrl = (req, file) => {
  if (req.profileImageUrl) return req.profileImageUrl;
  if (!file) return "";
  const relativePath = `/uploads/${file.filename}`;
  return `${req.protocol}://${req.get("host")}${relativePath}`;
};

const createUser = asyncHandler(async (req, res) => {
  const profileImageUrl = buildProfileImageUrl(req, req.file);

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobile: req.body.mobile,
    gender: req.body.gender,
    status: req.body.status,
    location: req.body.location,
    profileImageUrl
  });

  res.status(201).json({ success: true, data: user });
});

const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
  const search = (req.query.search || "").trim();

  const filter = {};
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1
    }
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const profileImageUrl = buildProfileImageUrl(req, req.file);
  if (profileImageUrl) {
    user.profileImageUrl = profileImageUrl;
  }

  const updatableFields = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "gender",
    "status",
    "location"
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted" });
});

const exportUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();

  if (!users.length) {
    throw new ApiError(404, "No users available for export");
  }

  const fields = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "gender",
    "status",
    "profileImageUrl",
    "location",
    "createdAt",
    "updatedAt"
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(users);

  const fileName = `users-${Date.now()}.csv`;
  const exportDir = path.join(__dirname, "..", "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  const filePath = path.join(exportDir, fileName);
  fs.writeFileSync(filePath, csv);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.status(200).send(csv);
});

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportUsers
};
