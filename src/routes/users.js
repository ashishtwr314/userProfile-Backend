const express = require("express");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middlewares/authenticateToken");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  let { username, name, password, email, profile_pic, role } = req.body;

  if (!password) {
    res.send({
      err: true,
      message: "No Password Foun",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  Users.create({
    username,
    name,
    password: hashedPassword,
    email,
    profile_pic,
    role,
  })
    .then((userCreatedResponse) => {
      if (userCreatedResponse) {
        res.send({
          err: false,
          message: "Sign up Successfull",
        });
      }
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

userRouter.post("/login", async (req, res) => {
  let { username, password } = req.body;

  Users.findOne({
    where: {
      username: username,
    },
  })
    .then(async (user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isValid) => {
          if (isValid) {
            const jwtToken = jwt.sign(
              {
                username: user.username,
                email: user.email,
                profile_pic: user.profile_pic,
                name: user.name,
                role: user.role,
              },
              process.env.JWT_SECRET
            );

            res.send({
              err: false,
              message: "Login Successfull",
              authToken: jwtToken,
            });
          } else {
            res.send({
              err: true,
              msg: "Email or Password is Invalid!",
            });
          }
        });
      } else {
        res.send({
          err: true,
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// ADMIN ROUTES

// --------------- GET INTERNS, and all TRAINERS

userRouter.get("/:role", authenticateToken, async (req, res) => {
  if (!req.params.role) return;

  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  Users.findAll({ where: { role: req.params.role } })
    .then((usersRes) => {
      res.send({
        err: false,
        users: usersRes,
      });
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

// --------------- ADD TRAINER
userRouter.post("/trainer/add", authenticateToken, async (req, res) => {
  let { username, name, password, email, profile_pic } = req.body;
  if (!password) {
    res.send({
      err: true,
      message: "No Password Found",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  Users.create({
    username,
    name,
    password: hashedPassword,
    email,
    profile_pic,
    role: "trainer",
  })
    .then((userCreatedResponse) => {
      if (userCreatedResponse) {
        res.send({
          err: false,
          message: "Trainer Created Successfull",
          trainerDetails: {
            username: username,
            password: password,
          },
        });
      }
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

// --------------- DELETE TRAINER

userRouter.delete("/trainer/:username", authenticateToken, async (req, res) => {
  if (!req.params.username) return;
  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  Users.destroy({
    where: {
      username: username,
    },
  })
    .then((deleteUserRes) => {
      if (deleteUserRes) {
        res.send({ err: false, message: "User successfully Deleted" });
      } else {
        res.send({ err: true, message: "User Not Found" });
      }
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

// -------------- UPDATE TRAINER DETAILS
userRouter.put("/trainer/:username", authenticateToken, async (req, res) => {
  if (!req.params.username) return;
  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }
  let { name, email, profile_pic } = req.body;

  Users.update(
    {
      name,
      email,
      profile_pic,
    },
    {
      where: {
        username: username,
      },
    }
  )
    .then((updateRes) => {
      if (updateRes[0]) {
        res.send({ err: false, message: "User successfully  Updated" });
      } else {
        res.send({ err: true, message: "User Not Found" });
      }
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

module.exports = userRouter;
