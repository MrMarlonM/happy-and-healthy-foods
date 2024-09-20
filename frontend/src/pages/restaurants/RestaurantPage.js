import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import AddDish from '../../components/AddDish';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({ results: [] })

  const {
    created_by,
    name,
    city,
    country,
    image,
    short_description,
    cuisine_type,
    updated_at,
    like_id,
    like_count,
    review_count,
  } = { ...restaurant.results[0] };

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
      <Card>
        <Card.Img variant="top" src={image} height="250px" />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            {short_description}
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>{country}</ListGroupItem>
          <ListGroupItem>{city}</ListGroupItem>
          <ListGroupItem>{cuisine_type}</ListGroupItem>
        </ListGroup>
        <Card.Body>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
      <Row>
        <Col>
          {is_creator && <AddDish />}
        </Col>
        <Col>
          Example
        </Col>
      </Row>
    </>
  )
}

export default RestaurantPage