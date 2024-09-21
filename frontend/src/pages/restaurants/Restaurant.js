import React from 'react';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const Restaurant = (props) => {
    const location = useLocation();
    const isRestaurantListPage = location.pathname === '/';

    const {
        id,
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
      } = props;

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
                    {isRestaurantListPage && <Link to={`/restaurants/${id}`}>
                        <Button>Click here for more infos</Button>
                    </Link>}
                </Card.Body>
            </Card>
        </>
    )
}

export default Restaurant