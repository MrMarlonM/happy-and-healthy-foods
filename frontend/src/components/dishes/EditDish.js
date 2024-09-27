import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import styles from '../../styles/RestaurantForm.module.css';

const EditDish = (props) => {
    const { id, setShowEditDish, setDishes } = props;
    const [imageChanged, setImageChanged] = useState(false);

    const [errors, setErrors] = useState({});
    const [dishData, setDishData] = useState({
        name: "",
        short_description: "",
        price: "",
        image: "",
        dietary_preference: "",
    });

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/dishes/${id}/`)
                const { name, short_description, price, image, dietary_preference } = data;
                setDishData({
                    name: name,
                    short_description: short_description,
                    price: price,
                    image: image,
                    dietary_preference: dietary_preference,
                });
            } catch (err) {

            }
        }
        handleMount();
    }, [id])

    const imageInput = useRef(null);

    const handleChange = (event) => {
        setDishData({
            ...dishData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(dishData.image);
            setDishData({
                ...dishData,
                image: URL.createObjectURL(event.target.files[0])
            });
            setImageChanged(true);
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formDataDish = new FormData();

        formDataDish.append('restaurant', dishData.id)
        formDataDish.append('name', dishData.name)
        formDataDish.append('short_description', dishData.short_description)
        formDataDish.append('price', dishData.price)
        formDataDish.append('dietary_preference', dishData.dietary_preference)
        if (imageChanged && imageInput?.current?.files[0]) {
            formDataDish.append('image', imageInput.current.files[0])
        }

        try {
            const { data: updatedDish } = await axiosRes.put(`/dishes/${id}/`, formDataDish);
            setDishes((prevDishes) => {
                const updatedResults = prevDishes.results.map((dish) => {
                    if (dish.id === id) {
                        return updatedDish;
                    } else {
                        return dish;
                    }
                });
                return { ...prevDishes, results: updatedResults };
            })
            setShowEditDish(false)
        } catch (err) {
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    }

    return (
        <Form className={styles.Form} onSubmit={handleSubmit}>
            <h3>Edit Dish</h3>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    name="name"
                    value={dishData.name}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors.name?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>Short description</Form.Label>
                <Form.Control
                    required
                    as="textarea"
                    rows={3}
                    name="short_description"
                    value={dishData.short_description}
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
                    required
                    min={0}
                    step="0.01"
                    type="number"
                    name="price"
                    value={dishData.price}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors.price?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <Form.Group>
                {dishData.image ?
                    <>
                        <figure>
                            <Image className={styles.Image} src={dishData.image} rounded />
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
                <Form.Label>dietary Preference</Form.Label>
                <Form.Control
                    as="select"
                    name="dietary_preference"
                    value={dishData.dietary_preference}
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
            <Button variant="primary" className='mx-1' type="submit">
                Save Changes
            </Button>
            <Button variant="secondary" className='mx-1' onClick={() => setShowEditDish(false)}>
                Cancel
            </Button>
            {errors.non_field_errors?.map((message, idx) =>
                <Alert variant="warning" key={idx} className='mt-3'>{message}</Alert>
            )}
        </Form>
    )
}

export default EditDish