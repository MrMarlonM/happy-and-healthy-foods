import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import AddDish from '../../components/AddDish';
import Restaurant from './Restaurant';
import AddReview from '../../components/AddReview';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({ results: [] })
  const { created_by } = {...restaurant.results[0]};

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: restaurant }] = await Promise.all([
          axiosReq.get(`/restaurants/${id}`)
        ]);
        setRestaurant({ results: [restaurant] });
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
          {is_creator && <AddDish />}
        </Col>
        <Col>
          <AddReview/>
        </Col>
      </Row>
    </>
  )
}

export default RestaurantPage