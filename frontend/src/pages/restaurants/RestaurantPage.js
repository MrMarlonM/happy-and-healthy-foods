import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import AddDish from '../../components/dishes/AddDish';
import Restaurant from './Restaurant';
import AddReview from '../../components/reviews/AddReview';
import Review from '../../components/reviews/Review';
import Dish from '../../components/dishes/Dish';
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from '../../utils/utils';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({ results: [] });
  const [dishes, setDishes] = useState({ results: [] });
  const [reviews, setReviews] = useState({ results: [] });
  const { created_by } = { ...restaurant.results[0] };
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [
          { data: restaurant },
          { data: dishes },
          { data: reviews },
        ] = await Promise.all([
          axiosReq.get(`/restaurants/${id}/`),
          axiosReq.get(`/dishes/?restaurant=${id}`),
          axiosReq.get(`/reviews/?restaurant=${id}`),
        ]);
        setRestaurant({ results: [restaurant] });
        setDishes(dishes);
        setReviews(reviews);
        setHasLoaded(true);
      } catch (err) {

      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      handleMount();
    }, 500)
    return () => {
      clearTimeout(timer);
    }
  }, [id]);

  const currentUser = useCurrentUser();
  const is_creator = currentUser?.username === created_by;

  return (
    <>
      {hasLoaded ?
        <>
          <Restaurant {...restaurant.results[0]} />
          <Row>
            <Col>
              {is_creator ? <AddDish setDishes={setDishes} /> : <h2>Dishes</h2>}
              {dishes.results.length ? (
                <InfiniteScroll
                  children={dishes.results.map(dish => (
                    <Dish key={dish.id} {...dish} is_creator={is_creator} setDishes={setDishes} dishes={dishes} />
                  ))}
                  dataLength={dishes?.results.length}
                  loader={<Asset/>}
                  hasMore={!!dishes.next}
                  next={() => fetchMoreData(dishes, setDishes)}
                />

              ) : "No dishes added yet..."}
            </Col>
            <Col>
              {currentUser ? <AddReview setReviews={setReviews} /> : <h2>Reviews</h2>}
              {reviews.results.length ? (
                <InfiniteScroll
                children={reviews.results.map(review => (
                  <Review key={review.id} {...review} setReviews={setReviews} />
                ))}
                dataLength={reviews?.results.length}
                loader={<Asset/>}
                hasMore={!!reviews.next}
                next={() => fetchMoreData(reviews, setReviews)}
              />
              ) : "No reviews yet, be the first to write one!"}
            </Col>
          </Row>
        </>
        : <Asset message="fetching the restaurant data..." />}
    </>
  )
}

export default RestaurantPage