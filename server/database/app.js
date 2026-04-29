/*jshint esversion: 8 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dealershipData = require("./data/dealerships.json");
const reviewData = require("./data/reviews.json");

const Dealership = require("./dealership");
const Review = require("./review");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  try {
    const dealerCount = await Dealership.countDocuments({});
    if (dealerCount === 0) {
      await Dealership.insertMany(dealershipData.dealerships);
      console.log("Seeded dealerships collection");
    }

    const reviewCount = await Review.countDocuments({});
    if (reviewCount === 0) {
      await Review.insertMany(reviewData.reviews);
      console.log("Seeded reviews collection");
    }
  } catch (error) {
    console.error("Error seeding MongoDB data", error);
  }
});

app.get("/fetchReviews", async (req, res) => {
  const reviews = await Review.find({});
  res.json({ status: 200, reviews: reviews });
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  const reviews = await Review.find({ dealership: req.params.id });
  res.json({ status: 200, reviews: reviews });
});

app.get("/fetchDealers", async (req, res) => {
  const dealers = await Dealership.find({});
  res.json({ status: 200, dealers: dealers });
});

app.get("/fetchDealers/:state", async (req, res) => {
  if (req.params.state === "All") {
    const dealers = await Dealership.find({});
    return res.json({ status: 200, dealers: dealers });
  }
  const dealers = await Dealership.find({ state: req.params.state });
  res.json({ status: 200, dealers: dealers });
});

app.get("/fetchDealer/:id", async (req, res) => {
  const dealer = await Dealership.find({ id: req.params.id });
  res.json({ status: 200, dealers: dealer });
});

app.post("/insert_review", async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.json({ status: "review saved" });
});

app.listen(3030, () => {
  console.log("Server running on port 3030");
});
