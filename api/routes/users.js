import User from "../models/User.js";
import express, { Router } from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (res) => {
    res.send("Hello User, you are logged in!")
});

router.get("/checkuser/:id", verifyUser, (res) => {
    res.send("Hello User, you are logged in and you can delete your account")
});

router.get("/checkadmin/:id", verifyAdmin, (res) => {
    res.send("Hello Admin, you are logged in and you can delete all accounts")
});

//UPDATE
router.put("/:id", verifyUser, async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
});

//DELETE
router.delete("/:id", verifyUser, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        next(err);
    }
});

//GET
router.get("/:id", verifyUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

//GET ALL
router.get("/", verifyAdmin, async (res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

export default router;