import React from 'react'
import { Button, Container } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';

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
    } = props;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/dishes/${id}`)
            setDishes((prevDishes) => ({
                ...prevDishes,
                results: prevDishes.results.filter((dish) => dish.id !== id),
            }))
        } catch(err) {

        }
    }

  return (
    <Container>
        <img src={image} alt={name} height={40}/>
        <p>{name}</p>
        <p>{price}</p>
        <p>{dietary_preference}</p>
        <p>{short_description}</p>
        {is_creator && <Button onClick={handleDelete}>Delete</Button>}
        {is_creator && <Button>Edit</Button>}
    </Container>
  )
}

export default Dish