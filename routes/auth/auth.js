const router = require("express").Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Joi = require("@hapi/joi")

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
})

router.post("/register", async (req, res) => {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        res.status(400).send("Email already exists");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPwd,
    })

    try {
        const { error } = await registerSchema.validateAsync(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const saveUser = await user.save();
            res.status(200).send("User created");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Incorrect Email");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Incorrect Password");

    try {
        const { error } = await loginSchema.validateAsync(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            res.header("auth-token", token).send(token)
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router