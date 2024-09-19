const express = require('express');
const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");

const router = express.Router();
const service = new UserService();

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { data } = await service.SignUp({ email, password });
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { data } = await service.SignIn({ email, password });
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
