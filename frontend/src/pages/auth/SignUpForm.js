import axios from 'axios';
import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Container, Form, Button, Alert} from 'react-bootstrap';
import styles from '../../styles/RestaurantForm.module.css';

const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });
    const {username, password1, password2} = signUpData;

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/dj-rest-auth/registration/', signUpData);
            history.push('/signin');
        } catch(err){
            setErrors(err.response?.data)
        };
    };

    return (
            <Form className={styles.Form} onSubmit={handleSubmit}>
                <h2 className='text-center'>Sign Up</h2>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={username}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors.username?.map((message, idx) => 
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}

                <Form.Group controlId="password1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        placeholder="Enter your password"
                        name="password1"
                        value={password1}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors.password1?.map((message, idx) => 
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                
                <Form.Group controlId="password2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Confirm your password"
                        name="password2"
                        value={password2}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors.password2?.map((message, idx) => 
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Button variant="primary" type="submit">
                    Sign up
                </Button>
                {errors.non_field_errors?.map((message, idx) => 
                    <Alert variant="warning" key={idx} className='mt-3'>{message}</Alert>
                )}
            </Form>
    )
}

export default SignUpForm