import React, { useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap';
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
    const [show, setShow] = useState(false);
    
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/dishes/${id}/`)
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
                        {is_creator && <Button variant='danger' className='mx-1' onClick={handleShow}>Delete</Button>}
                        {is_creator && <Button className='mx-1' onClick={() => setShowEditDish(true)}>Edit</Button>}
                    </Card.Body>
                </Card>
            )}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the dish {name}?</Modal.Body>
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

export default Dish