import React from 'react';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';

const Restaurant = (props) => {
    const location = useLocation();
    const isRestaurantListPage = location.pathname === '/' || location.pathname === '/myrestaurants';
    const currentUser = useCurrentUser();
    const history = useHistory();

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

    const is_creator = created_by === currentUser?.username;
    
    const handleEdit = () => {
        history.push(`/restaurants/${id}/edit`)
    }

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/restaurants/${id}`)
            history.push('/myrestaurants');
        } catch(err){

        }
    }

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
                    {is_creator && <Button onClick={handleEdit}>Edit restaurant</Button>}
                    {is_creator && <Button onClick={handleDelete}>Delete restaurant</Button>}
                </Card.Body>
            </Card>
        </>
    )
}

export default Restaurant