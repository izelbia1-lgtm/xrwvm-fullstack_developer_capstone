const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Dealership = require("./dealership");
const Review = require("./review");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb://mongo_db:27017/dealershipsDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);



/* ===========================
   FETCH ALL REVIEWS
=========================== */

app.get("/fetchReviews", async (req, res) => {

  const reviews = await Review.find({});

  res.json({
    status: 200,
    reviews: reviews
  });

});


/* ===========================
   FETCH REVIEWS BY DEALER
=========================== */

app.get("/fetchReviews/dealer/:id", async (req, res) => {

  const id = req.params.id;

  const reviews = await Review.find({
    dealership: id
  });

  res.json({
    status: 200,
    reviews: reviews
  });

});


/* ===========================
   FETCH ALL DEALERS
=========================== */

app.get("/fetchDealers", async (req, res) => {

  const dealers = await Dealership.find({});

  res.json({
    status: 200,
    dealers: dealers
  });

});


/* ===========================
   FETCH DEALERS BY STATE
=========================== */

app.get("/fetchDealers/:state", async (req, res) => {

  const state = req.params.state;

  const dealers = await Dealership.find({
    state: state
  });

  res.json({
    status: 200,
    dealers: dealers
  });

});


/* ===========================
   FETCH DEALER BY ID
=========================== */

app.get("/fetchDealer/:id", async (req, res) => {

  const id = req.params.id;

  const dealer = await Dealership.find({
    id: id
  });

  res.json({
    status: 200,
    dealers: dealer
  });

});


/* ===========================
   INSERT REVIEW
=========================== */

app.post("/insert_review", async (req, res) => {

  const review = new Review(req.body);

  await review.save();

  res.json({
    status: "review saved"
  });

});


app.listen(3030, () => {
  console.log("Server running on port 3030");
});