import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';

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
    }

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
    }


  return (
    <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
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
        >
            Save changes
        </Button>
        <Button 
            variant="primary"
            onClick={() => setShowEditForm(false)}
        >
            Cancel
        </Button>
    </Form>
  )
}

export default EditReview