import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import styles from '../../styles/RestaurantForm.module.css';
import Asset from "../../components/Asset";

const RestaurantEdit = () => {
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
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
                const { name, city, country, image, short_description, cuisine_type, is_owner } = data;

                is_owner ?
                    setRestaurantData({
                        name: name,
                        city: city,
                        country: country,
                        image: image,
                        short_description: short_description,
                        cuisine_type: cuisine_type,
                    }) : history.push('/');
                setHasLoaded(true);
            } catch (err) {

            }
        }
        setHasLoaded(false);
        const timer = setTimeout(() => {
            handleMount();
        }, 500)
        return () => {
            clearTimeout(timer);
        }
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
            setImageChanged(true);
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append('name', restaurantData.name)
        formData.append('city', restaurantData.city)
        formData.append('country', restaurantData.country)
        formData.append('short_description', restaurantData.short_description)
        formData.append('cuisine_type', restaurantData.cuisine_type)
        if (imageChanged && imageInput?.current?.files[0]) {
            formData.append('image', imageInput.current.files[0])
        }

        try {
            console.log(formData)
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
            {hasLoaded ?
                <Form className={styles.Form} onSubmit={handleSubmit}>
                    <h2 className='text-center'>Edit Restaurant</h2>
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
                    <Form.Group>
                        {restaurantData.image ?
                            <>
                                <figure>
                                    <Image className={styles.Image} src={restaurantData.image} rounded />
                                </figure>
                            </> :
                            <p><strong>Upload an image first to see a preview...</strong></p>}
                        <Form.File
                            id="image-upload"
                            accept='image/*'
                            onChange={handleChangeImage}
                            ref={imageInput}
                        />
                    </Form.Group>
                    {errors.image?.map((message, idx) =>
                        <Alert variant="warning" key={idx}>{message}</Alert>
                    )}
                    <Form.Group>
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
                        variant="danger"
                        onClick={() => history.goBack()}
                    >
                        Cancel
                    </Button>
                    {errors.non_field_errors?.map((message, idx) =>
                        <Alert className='mt-3' variant="warning" key={idx}>{message}</Alert>
                    )}
                </Form>
                : <Asset message="Loading restaurant data into form ..." />}
        </>
    )
}


export default RestaurantEdit