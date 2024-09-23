import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import EditDish from './EditDish';
import styles from "../../styles/Restaurant.module.css";

const Dish = (props) => {
    const {
        id,
        is_creator,
        setDishes,
        name,
        short_description,
        price,
        image,
        dietary_preference,
        updated_at,
    } = props;

    const [showEditDish, setShowEditDish] = useState(false);

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/dishes/${id}`)
            setDishes((prevDishes) => ({
                ...prevDishes,
                results: prevDishes.results.filter((dish) => dish.id !== id),
            }))
        } catch (err) {

        }
    }

    return (
        <>
            {showEditDish ? (
                <EditDish
                    id={id}
                    setShowEditDish={setShowEditDish}
                    setDishes={setDishes}
                />
            ) : (
                <Card className='my-2'>
                    <Card.Img className={styles.Image} variant="top" src={image} alt={name} />
                    <Card.Header as="h5">{dietary_preference}</Card.Header>
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>
                            Price: {price} €
                        </Card.Text>
                        <Card.Text>
                            {short_description}
                        </Card.Text>
                        <Card.Text className='text-muted'>Last updated at: {updated_at}</Card.Text>
                        {is_creator && <Button className='mx-1' onClick={handleDelete}>Delete</Button>}
                        {is_creator && <Button variant='danger' className='mx-1' onClick={() => setShowEditDish(true)}>Edit</Button>}
                    </Card.Body>
                </Card>
            )}
        </>
    )
}

export default Dish