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

export { router as TrackRoutes };
