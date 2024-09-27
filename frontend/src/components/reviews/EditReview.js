import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { axiosRes } from '../../api/axiosDefaults';
import styles from '../../styles/RestaurantForm.module.css';

const EditReview = (props) => {
    const {
        id,
        content,
        setShowEditForm,
        setReviews,
    } = props;

    const [formContent, setFormContent] = useState(content);

    const handleChange = (event) => {
        setFormContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put(`/reviews/${id}/`, {
                content: formContent.trim(),
            });
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews.results.map((review) => {
                    return review.id === id ? {
                        ...review,
                        content: formContent.trim(),
                        updated_at: "now",
                    } : review;
                }),
            }));
            setShowEditForm(false);
        } catch(err) {

        }
    };


  return (
    <Form className={styles.Form} onSubmit={handleSubmit}>
        <h3>Edit Review</h3>
        <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
                required
                as="textarea"
                rows={3}
                name="content"
                value={formContent}
                onChange={handleChange}
            />
        </Form.Group>
        <Button 
            variant="primary"
            type="submit"
            disabled={!content.trim()}
            className='mx-1'
        >
            Save changes
        </Button>
        <Button 
            variant="primary"
            className='mx-1'
            onClick={() => setShowEditForm(false)}
        >
            Cancel
        </Button>
    </Form>
  )
}

export default EditReview
