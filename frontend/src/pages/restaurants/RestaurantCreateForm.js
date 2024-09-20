import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const RestaurantCreateForm = () => {
    const [errors, setErrors] = useState({});

    const [restaurantData, setRestaurantData] = useState({
        name: "",
        city: "",
        country: "",
        image: "",
        short_description: "",
        cuisine_type: "",
    });
    const { name, city, country, image, short_description, cuisine_type } = restaurantData;

    const handleChange = (event) => {
        setRestaurantData({
            ...restaurantData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setRestaurantData({
                ...restaurantData,
                image: URL.createObjectURL(event.target.files[0])
            });
        };
    };

    return (
        <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange} 
                    placeholder="Name of the restaurant"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleChange}
                    placeholder="City of the restaurant"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    type="text"
                    name="country"
                    value={country}
                    onChange={handleChange}
                    placeholder="Country of the restaurant"
                />
            </Form.Group>
            <Form.File
                id="image-upload"
                label="Click here to upload an image of the restaurant"
                accept='image/*'
                onChange={handleChangeImage}
            />
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
            <Form.Group>
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Control
                    as="select"
                    name="cuisine_type"
                    value={cuisine_type}
                    onChange={handleChange}
                >
                    <option>Italian</option>
                    <option>Indian</option>
                    <option>German</option>
                    <option>Japanese</option>
                    <option>Chinese</option>
                    <option>Thai</option>
                    <option>Mexican</option>
                    <option>Greek</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>Vietnamese</option>
                    <option>Korean</option>
                    <option>Other</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default RestaurantCreateForm