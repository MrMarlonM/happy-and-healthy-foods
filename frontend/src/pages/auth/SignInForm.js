import React, { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {useHistory} from 'react-router-dom';

const SignInForm = () => {
    const [signInData, setSignInData] = useState({
        username: "",
        password: "",
    });
    const {username, password} = signInData;
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('dj-rest-auth/login/', signInData);
            history.push('/');
        } catch(err) {
            setErrors(err.response?.data)
            console.log(err.response.data)
        }
    }

    const handleChange = (event) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value,
        });
    };


  return (
    <Container>
            <h1>Sign in</h1>
            <Form onSubmit={handleSubmit}>
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

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors.password?.map((message, idx) => 
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
                <Button variant="primary" type="submit">
                    Sign in
                </Button>
                {errors.non_field_errors?.map((message, idx) => 
                    <Alert variant="warning" key={idx} className='mt-3'>{message}</Alert>
                )}
            </Form>
        </Container>
  )
}

export default SignInForm