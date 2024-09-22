import React, { useRef, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

const AddDish = () => {
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const [dishData, setDishData] = useState({
        name: "",
        short_description: "",
        price: 0,
        image: "",
        dietary_preference: "vegetarian",
    });
    const { name, short_description, price, image, dietary_preference } = dishData;

    const imageInput = useRef(null);

    const handleChange = (event) => {
        setDishData({
            ...dishData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setDishData({
                ...dishData,
                image: URL.createObjectURL(event.target.files[0])
            });
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formDataDish = new FormData();

        formDataDish.append('restaurant', id)
        formDataDish.append('name', name)
        formDataDish.append('short_description', short_description)
        formDataDish.append('price', price)
        formDataDish.append('image', imageInput.current.files[0])
        formDataDish.append('dietary_preference', dietary_preference)

        try {
            await axiosReq.post('/dishes/', formDataDish);
        } catch (err) {
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Name of the dish"
                />
            </Form.Group>
            {errors.name?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>Short description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="short_description"
                    value={short_description}
                    onChange={handleChange}
                    placeholder="Add a short description here"
                />
            </Form.Group>
            {errors.short_description?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    placeholder="€"
                />
            </Form.Group>
            {errors.price?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <Form.File
                id="image-upload-dish"
                label="Click here to upload an image of the restaurant"
                accept='image/*'
                onChange={handleChangeImage}
                ref={imageInput}
            />
            <Form.Group>
                {errors.image?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Form.Label>dietary Preference</Form.Label>
                <Form.Control
                    as="select"
                    name="dietary_preference"
                    value={dietary_preference}
                    onChange={handleChange}
                >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="gluten-free">Gluten-free</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option>
                    <option value="other">other</option>
                </Form.Control>
                {errors.dietary_preference?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Dish
            </Button>
            {errors.non_field_errors?.map((message, idx) =>
                <Alert variant="warning" key={idx} className='mt-3'>{message}</Alert>
            )}
        </Form>
    )
}

export default AddDish