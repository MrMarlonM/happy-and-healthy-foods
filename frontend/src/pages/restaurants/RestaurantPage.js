import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, ListGroup, ListGroupItem, Row, Button } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import AddDish from '../../components/dishes/AddDish';
import Restaurant from './Restaurant';
import AddReview from '../../components/reviews/AddReview';
import Review from '../../components/reviews/Review';
import Dish from '../../components/dishes/Dish';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({ results: [] });
  const [dishes, setDishes] = useState({ results: [] });
  const [reviews, setReviews] = useState({ results: [] });
  const { created_by } = { ...restaurant.results[0] };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [
          { data: restaurant },
          { data: dishes },
          { data: reviews },
        ] = await Promise.all([
          axiosReq.get(`/restaurants/${id}`),
          axiosReq.get(`/dishes/?restaurant=${id}`),
          axiosReq.get(`/reviews/?restaurant=${id}`),
        ]);
        setRestaurant({ results: [restaurant] });
        setDishes(dishes);
        setReviews(reviews);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  const currentUser = useCurrentUser();
  const is_creator = currentUser?.username === created_by;

  return (
    <>
      <Restaurant {...restaurant.results[0]} />
      <Row>
        <Col>
          {is_creator ? <AddDish setDishes={setDishes} /> : <h2>Dishes</h2>}
          {dishes.results.length ? (
            dishes.results.map(dish => (
              <Dish key={dish.id} {...dish} is_creator={is_creator} setDishes={setDishes} dishes={dishes}/>
            ))
          ) : "No dishes added yet..."}
        </Col>
        <Col>
          {currentUser ? <AddReview setReviews={setReviews} /> : "Reviews"}
          {reviews.results.length ? (
            reviews.results.map(review => (
              <Review key={review.id} {...review} setReviews={setReviews}/>
            ))
          ) : "No reviews yet, be the first to write one!"}
        </Col>
      </Row>
    </>
  )
}

export default RestaurantPage