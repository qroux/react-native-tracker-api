import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import mongoose from "mongoose";

const Track = mongoose.model("Track");
const router = express.Router();

// use requireauth middleware for every route inside trackroutes
router.use(requireAuth);

// ROUTES
router.get("/tracks", async (req, res) => {
  try {
    const tracks = await Track.find({ userId: req.user._id });
    res.send(tracks);
  } catch (err) {
    res.status(422).send(err);
  }
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res.status(422).send({ error: "Missing name or locations" });
  }

  try {
    const track = new Track({ userId: req.user._id, name, locations });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

export { router as TrackRoutes };
