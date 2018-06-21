const mongoose = require("mongoose"),
  requireLogin = require("../middlewares/requireLogin"),
  requireCredits = require("../middlewares/requireCredits"),
  Profile = mongoose.model("profiles");

module.exports = app => {
  app.get("/api/profiles", requireLogin, async (req, res) => {
    const profiles = await Profile.find({ _user: req.user.id });

    res.send(profiles);
  });

  app.post("/api/profiles", requireLogin, requireCredits, async (req, res) => {
    const { name, birthdate, description } = req.body;
    const profile = new Profile({
      name,
      birthdate,
      description,
      _user: req.user.id
    });

    try {
      await profile.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.delete("/api/profiles", requireLogin, async (req, res) => {
    try {
      await Profile.findByIdAndRemove(req.body.id);
      req.user.credits += 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};