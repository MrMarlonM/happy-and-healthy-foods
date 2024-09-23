import React, { useState } from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Button, Card } from 'react-bootstrap';
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
                <Card className="my-2">
                    <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">
                            <span className='mx-1'>{created_by}</span>
                            <span className='mx-1'>{updated_at}</span>
                        </Card.Subtitle>
                        <Card.Text>
                            {content}
                        </Card.Text>
                        {is_creator && !showEditForm && <div>
                            <Button className='mx-1' onClick={() => setShowEditForm(true)}>Edit</Button>
                            <Button variant='danger' className='mx-1' onClick={handleDelete}>Delete</Button>
                        </div>}
                    </Card.Body>
                </Card>
            }
        </div>
    )
}

export default Review