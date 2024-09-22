import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

const RestaurantEdit = () => {
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        city: "",
        country: "",
        image: "",
        short_description: "",
        cuisine_type: "italian",
    });
    const history = useHistory();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosRes.get(`/restaurants/${id}`)
                const { name, city, country, image, short_description, cuisine_type } = data;
                setRestaurantData({
                    name: name,
                    city: city,
                    country: country,
                    image: image,
                    short_description: short_description,
                    cuisine_type: cuisine_type,
                })
            } catch (err) {

            }
        }
        handleMount();
    }, [history, id])

    const imageInput = useRef(null);

    const handleChange = (event) => {
        setRestaurantData({
            ...restaurantData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(restaurantData.image);
            setRestaurantData({
                ...restaurantData,
                image: URL.createObjectURL(event.target.files[0])
            });
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append('name', restaurantData.name)
        formData.append('city', restaurantData.city)
        formData.append('country', restaurantData.country)
        formData.append('image', imageInput.current.files[0])
        formData.append('short_description', restaurantData.short_description)
        formData.append('cuisine_type', restaurantData.cuisine_type)

        try {
            await axiosReq.put(`/restaurants/${id}/`, formData);
            history.push(`/restaurants/${id}`)
        } catch (err) {
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={restaurantData.name}
                        onChange={handleChange}
                        placeholder="Name of the restaurant"
                    />
                </Form.Group>
                {errors.name?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={restaurantData.city}
                        onChange={handleChange}
                        placeholder="City of the restaurant"
                    />
                </Form.Group>
                {errors.city?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        name="country"
                        value={restaurantData.country}
                        onChange={handleChange}
                        placeholder="Country of the restaurant"
                    />
                </Form.Group>
                {errors.country?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Form.File
                    id="image-upload"
                    label="Click here to upload an image of the restaurant"
                    accept='image/*'
                    onChange={handleChangeImage}
                    ref={imageInput}
                />
                <Form.Group>
                    {errors.image?.map((message, idx) =>
                        <Alert variant="warning" key={idx}>{message}</Alert>
                    )}
                    <Form.Label>Short description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="short_description"
                        value={restaurantData.short_description}
                        onChange={handleChange}
                        placeholder="Add a short description here"
                    />
                </Form.Group>
                {errors.short_description?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Form.Group>
                    <Form.Label>Cuisine Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="cuisine_type"
                        value={restaurantData.cuisine_type}
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
                {errors.cuisine_type?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
                <Button
                    className="mx-2"
                    variant="primary"
                    onClick={() => history.goBack()}
                >
                    Cancel
                </Button>
                {errors.non_field_errors?.map((message, idx) =>
                    <Alert className='mt-3' variant="warning" key={idx}>{message}</Alert>
                )}
            </Form>
        </>
    )
}


export default RestaurantEdit