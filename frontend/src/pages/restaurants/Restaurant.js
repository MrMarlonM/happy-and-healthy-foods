import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const Restaurant = (props) => {
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
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
            </Card>
        </>
    )
}

export default Restaurant