const express = require("express");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", { useNewUrlParser: true });

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.get("/workout.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/workout.js"));
});

app.get("/exercise.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.js"));
});

app.get("/stats.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.js"));
});

app.get("/api/workouts", function (req, res) {
  db.Workout.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err)
    })
    });

app.post("/api/workouts", function (req, res) {
  db.Workout.create({})
    .then(data => res.json(data))
      .catch(err => {
        console.log("err", err)
        res.json(err)
      })
    });

app.put("/api/workouts/:id", ({ body, params }, res) => {
  db.Workout.findByIdAndUpdate(
    params.id,
      { $push: { exercises: body } },
      { new: true, runValidators: true }
  )
    .then(data => res.json(data))
    .catch(err => {
      console.log("err", err)
      res.json(err)
    })
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});