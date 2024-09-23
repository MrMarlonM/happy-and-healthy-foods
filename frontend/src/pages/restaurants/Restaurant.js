import React, { useState } from 'react';
import styles from "../../styles/Restaurant.module.css"
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes, axiosReq } from '../../api/axiosDefaults';

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
        } catch (err) {

        }
    }

    const handleSaveRestaurant = async () => {
        try {
            const response = await axiosReq.get(`/profiles/`)
            const profileList = response.data.results
            const profile = profileList.filter(profile => profile.owner === currentUser.username);
            const profileId = (profile[0].id);
            console.log(profileId);
            await axiosRes.put(`/profiles/${profileId}/favorites/`, { restaurant_id: id });
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Card className={styles.Restaurant}>
                {currentUser && <Button variant='secondary' onClick={handleSaveRestaurant}>Save as favorite</Button>}
                <Card.Img className={styles.Image} variant="top" src={image} />
                <Card.Body>
                    <Card.Title><h3>{name}</h3></Card.Title>
                    <Card.Text className={styles.Italic}>
                        {cuisine_type}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Short Description: <br/>{short_description}</ListGroupItem>
                    <ListGroupItem>Country: <br/>{country}</ListGroupItem>
                    <ListGroupItem>City: <br/>{city}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    {isRestaurantListPage && <Link to={`/restaurants/${id}`}>
                        <Button variant='link' block>Click here for more infos...</Button>
                    </Link>}
                </Card.Body>
                {is_creator && <Card.Body className={styles.ItemsCenter}>
                    <Button className={styles.Button} variant='info' onClick={handleEdit}>Edit restaurant</Button>
                    <Button className={styles.Button} variant='danger' onClick={handleDelete}>Delete restaurant</Button>
                </Card.Body>}
            </Card>
        </>
    )
}

export default Restaurant