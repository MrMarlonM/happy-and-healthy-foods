import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosReq } from '../../api/axiosDefaults';

const RestaurantCreateForm = () => {
    const [errors, setErrors] = useState({});

    const [restaurantData, setRestaurantData] = useState({
        name: "",
        city: "",
        country: "",
        image: "",
        short_description: "",
        cuisine_type: "italian",
    });
    const { name, city, country, image, short_description, cuisine_type } = restaurantData;

    const imageInput = useRef(null);
    const history = useHistory();

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

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append('name', name)
        formData.append('city', city)
        formData.append('country', country)
        formData.append('image', imageInput.current.files[0])
        formData.append('short_description', short_description)
        formData.append('cuisine_type', cuisine_type)

        try {
            const {data} = await axiosReq.post('/restaurants/', formData);
            history.push(`/restaurants/${data.id}`)
        } catch(err) {
            console.log(err);
            if (err.response?.status !== 401){
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
                ref={imageInput}
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
                    <option value="italian">Italian</option>
                    <option value="indian">Indian</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                    <option value="thai">Thai</option>
                    <option value="mexican">Mexican</option>
                    <option value="greek">Greek</option>
                    <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                    <option value="vietnamese">Vietnamese</option>
                    <option value="korean">Korean</option>
                    <option value="other">Other</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default RestaurantCreateForm