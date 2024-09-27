import React, { useState } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { axiosRes } from '../../api/axiosDefaults';
import EditReview from './EditReview';

const Review = (props) => {
    const currentUser = useCurrentUser();
    const [show, setShow] = useState(false);

    const {
        id,
        created_by,
        updated_at,
        content,
        setReviews,
    } = props;
    const [showEditForm, setShowEditForm] = useState(false);

    const is_creator = currentUser.username === created_by;

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/reviews/${id}/`);
            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews.results.filter((review) => review.id !== id),
            }));
        } catch (err) {

        }
    };

    return (
        <>
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
                                <Button variant='info' className='mx-1' onClick={() => setShowEditForm(true)}>Edit</Button>
                                <Button variant='danger' className='mx-1' onClick={handleShow}>Delete</Button>
                            </div>}
                        </Card.Body>
                    </Card>
                }
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your review?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>
                        Confirm
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Review