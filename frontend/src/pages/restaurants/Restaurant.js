import React, { useState } from 'react';
import styles from "../../styles/Restaurant.module.css"
import { Button, Card, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';

const Restaurant = (props) => {
    const location = useLocation();
    const isRestaurantListPage = location.pathname === '/' || location.pathname === '/myrestaurants';
    const currentUser = useCurrentUser();
    const history = useHistory();
    const [show, setShow] = useState(false);

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

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleEdit = () => {
        history.push(`/restaurants/${id}/edit/`)
    }

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/restaurants/${id}/`)
            history.push('/myrestaurants');
        } catch (err) {

        }
    }

    return (
        <>
            <Card className={styles.Restaurant}>
                <Card.Img alt={name} className={styles.Image} variant="top" src={image} />
                <Card.Body>
                    <Card.Title><h3>{name}</h3></Card.Title>
                    <Card.Text className={styles.Italic}>
                        {cuisine_type}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Short Description: <br />{short_description}</ListGroupItem>
                    <ListGroupItem>Country: <br />{country}</ListGroupItem>
                    <ListGroupItem>City: <br />{city}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    {isRestaurantListPage && <Link to={`/restaurants/${id}/`}>
                        <Button variant='link' block>Click here for more infos...</Button>
                    </Link>}
                    <Card.Text className='text-muted text-center'>Last updated at: {updated_at}</Card.Text>
                </Card.Body>
                {is_creator && <Card.Body className={styles.ItemsCenter}>
                    <Button className={styles.Button} variant='info' onClick={handleEdit}>Edit restaurant</Button>
                    <Button className={styles.Button} variant='danger' onClick={handleShow}>Delete restaurant</Button>
                </Card.Body>}
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the restaurant {name}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>
                        Confirm
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Restaurant