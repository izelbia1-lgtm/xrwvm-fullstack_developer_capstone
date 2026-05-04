import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("dealer"));
  let params = useParams();
  let id = params.id;

  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let reviews_url = root_url + `djangoapp/reviews/dealer/${id}`;
  let post_review = root_url + `postreview/${id}`;

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      setDealer(dealerobjs[0]);
    }
  };

  const get_reviews = async () => {
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  const getSentimentStyle = (sentiment) => {
    if (sentiment === "positive") {
      return { color: "green", fontWeight: "bold" };
    }
    if (sentiment === "negative") {
      return { color: "red", fontWeight: "bold" };
    }
    return { color: "orange", fontWeight: "bold" };
  };

  useEffect(() => {
    get_dealer();
    get_reviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{ width: '55px', marginLeft: '15px', verticalAlign: 'middle' }}
            alt='Post Review'
          />
        </a>
      );
    }
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "25px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}{postReview}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div style={{ marginTop: "30px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {reviews.length === 0 && unreviewed === false ? (
          <p>Loading Reviews...</p>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              style={{
                width: "280px",
                minHeight: "260px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "18px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                backgroundColor: "white"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img
                  src={senti_icon(review.sentiment)}
                  style={{ width: "45px" }}
                  alt='Sentiment'
                />
              </div>

              <p style={{ fontSize: "18px", minHeight: "70px" }}>
                {review.review}
              </p>

              <p style={{ fontStyle: "italic", color: "grey" }}>
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </p>

              <p style={getSentimentStyle(review.sentiment)}>
                Sentiment: {review.sentiment ? review.sentiment.toUpperCase() : "NEUTRAL"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;