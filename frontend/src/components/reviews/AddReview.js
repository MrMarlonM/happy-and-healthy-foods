import React, { useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/RestaurantForm.module.css';

const AddReview = (props) => {
    const currentUser = useCurrentUser();
    const { id } = useParams();
    const [reviewData, setReviewData] = useState({
        content: "",
    });
    const { content } = reviewData;
    const { setReviews } = props;

    const handleChange = event => {
        setReviewData({
            ...reviewData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataReview = new FormData();

        formDataReview.append('restaurant', id);
        formDataReview.append('created_by', currentUser);
        formDataReview.append('content', content);

        try {
            const {data} = await axiosReq.post('/reviews/', formDataReview);
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: [data, ...prevReviews.results],
            }));
            setReviewData({content: ""});
        } catch(err) {

        }
    };

  return (
    <Form className={styles.Form} onSubmit={handleSubmit}>
        <h3>Add new Review</h3>
        <Form.Group>
            <Form.Label className='d-none'>Content</Form.Label>
            <Form.Control
                required
                as="textarea"
                rows={3}
                name="content"
                value={content}
                onChange={handleChange}
                placeholder="Write your review here..."
            />
        </Form.Group>
        <Button 
            variant="primary"
            type="submit"
            disabled={!content.trim()}
        >
            Add review
        </Button>
    </Form>
  )
}

export default AddReview