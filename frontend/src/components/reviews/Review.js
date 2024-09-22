import React, { useState } from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Button } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import EditReview from './EditReview';

const Review = (props) => {
    const currentUser = useCurrentUser();

    const {
        id,
        created_by,
        updated_at,
        content,
        restaurant,
        setReviews,
    } = props;
    const [showEditForm, setShowEditForm] = useState(false);

    const is_creator = currentUser.username === created_by;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/reviews/${id}`);
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews.results.filter((review) => review.id !== id),
            }))
        } catch (err) {

        }
    }

    return (
        <div>
            {showEditForm ? (
                <EditReview 
                    content={content}
                    setShowEditForm={setShowEditForm}
                    id={id}
                    setReviews={setReviews}
                />
            ) : 
                <p>{content}</p>
            }
            <span>{created_by}</span>
            <span>{updated_at}</span>
            {is_creator && !showEditForm && <div>
                <Button onClick={() => setShowEditForm(true)}>Edit</Button>
                <Button onClick={handleDelete}>Delete</Button>
            </div>}
        </div>
    )
}

export default Review