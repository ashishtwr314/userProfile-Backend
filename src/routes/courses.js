const express = require("express");
const Courses = require("../models/courses");
const Assignment = require("../models/assignment");
const coursesRouter = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const Sequelize = require("sequelize");
const Users = require("../models/users");

coursesRouter.get("/", authenticateToken, (req, res) => {
  Courses.findAll()
    .then((courses) => {
      res.status(200).send({
        err: false,
        courses: courses,
      });
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// ADMIN ROUTES

// -------------- ADD COURSES

coursesRouter.post("/add", authenticateToken, (req, res) => {
  let {
    course_id,
    course_name,
    course_dis,
    course_price,
    course_lessons,
  } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permissions",
    });
  }

  Courses.create({
    course_id,
    course_name,
    course_dis,
    course_price,
    course_lessons,
  })
    .then((coursesResponse) => {
      if (coursesResponse) {
        res.send({
          err: false,
          message: "Course added Successfully",
        });
      } else {
        res.send({
          err: true,
          message: "Failed to add Course",
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

// -------------- DELETE COURSES

coursesRouter.delete("/:course_id", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  Courses.destroy({
    where: {
      course_id: req.body.course_id,
    },
  })
    .then((cousrDelRes) => {
      if (cousrDelRes) {
        res.send({
          err: false,
          message: "Successfully Deleted the course",
        });
      } else {
        res.send({
          err: true,
          message: "No Such Course",
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

// -------------- UPDATE COURSES

coursesRouter.put("/:course_id", authenticateToken, (req, res) => {
  if (!req.params.course_id) return;
  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  let { course_name, course_dis, course_price, course_lessons } = req.body;

  Courses.update(
    {
      course_name,
      course_dis,
      course_price,
      course_lessons,
    },
    {
      where: {
        course_id: req.params.course_id,
      },
    }
  )
    .then((updateRes) => {
      if (updateRes[0]) {
        res.send({
          err: false,
          message: "Updated Successfully",
        });
      } else {
        res.send({
          err: true,
          message: "Updation Failed",
        });
      }
      console.log(updateRes);
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

// ------------  ASSIGN TRAINERS TO A COURSE

coursesRouter.post("/assigntrainer", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  let { username, course_id } = req.body;

  Assignment.create({
    username,
    course_id,
    role: "trainer",
  })
    .then((assigRes) => {
      if (assigRes) {
        res.send({
          err: false,
          message: "Trainer successfully assigned",
        });
      } else {
        res.send({
          err: true,
          message: "Trainer assignemnt failed",
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

//  TRAINER ROUTES

// --------- GET COURSES BY USERNAME
coursesRouter.get("/assignedcourses", authenticateToken, (req, res) => {
  Assignment.findAll({
    where: {
      username: req.user.username,
    },
  })
    .then((assignResponse) => {
      console.log();
      if (assignResponse) {
        Courses.findAll({
          where: {
            course_id: {
              [Sequelize.Op.in]: assignResponse.map((x) => x.course_id),
            },
          },
        })
          .then((coursesRes) => {
            res.send({
              err: false,
              courses: coursesRes,
            });
          })
          .catch((err) => {
            res.send({
              err: true,
              message: err.message,
            });
          });
      } else {
        res.send({
          err: false,
          courses: assignResponse,
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

//  -------- ALL STUDENTS ENROLLED IN A COURSE

coursesRouter.get(
  "/assignedinterns/:course_id",
  authenticateToken,
  (req, res) => {
    if (!req.params.course_id) return;
    Assignment.findAll({
      where: {
        course_id: req.params.course_id,
        role: "intern",
      },
    })
      .then((assignResponse) => {
        if (assignResponse) {
          Users.findAll({
            where: {
              username: {
                [Sequelize.Op.in]: assignResponse.map((x) => x.username),
              },
            },
          })
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
        } else {
          res.send({
            err: false,
            courses: assignResponse,
          });
        }
      })

      .catch((err) => {
        res.send({
          err: true,
          message: err.message,
        });
      });
  }
);

// INTERNS ROUTES

// ---------- COURSE INFORMATION BY COURSE_ID

coursesRouter.get("/:course_id", authenticateToken, (req, res) => {
  if (!req.params.course_id) return;
  Courses.findOne({
    where: {
      course_id: req.params.course_id,
    },
  })
    .then((courseRes) => {
      res.send({
        err: false,
        course: courseRes,
      });
    })
    .catch((err) => {
      res.send({
        err: true,
        message: err.message,
      });
    });
});

// --------- REGISTER BY COURSE_ID
coursesRouter.get("/register/:course_id", authenticateToken, (req, res) => {
  if (!req.params.course_id) return;
  if (req.user.role !== "intern") {
    return res.status(403).send({
      err: true,
      message: "You dont have permission!",
    });
  }

  console.log("USERNAME", req.user.username);
  Assignment.create({
    username: req.user.username,
    course_id: req.params.course_id,
    role: "intern",
  })
    .then((assignRes) => {
      if (assignRes) {
        res.send({
          err: false,
          message: "Successfully registered!",
        });
      } else {
        res.send({
          err: false,
          message: "Registration Unsuccessfull!",
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

module.exports = coursesRouter;
