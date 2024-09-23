import React, { useEffect, useState } from 'react'
import { axiosReq } from '../api/axiosDefaults';

const SavedRestaurants = (props) => {
    const { currentUser } = props;
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

    useEffect(() => {
        const fetchProfileFavorite = async () => {
            try {
                const response = await axiosReq.get(`/profiles/`)
                const profileList = response.data.results
                const profile = profileList.filter(profile => profile.owner === currentUser.username);
                setFavoriteRestaurants(profile[0].favorites)
            } catch (err) {

            }
        }
        fetchProfileFavorite();
    }, []);

    return (
        <div>
            <h3>Your saved Restaurants</h3>
            {favoriteRestaurants.length ?
                (favoriteRestaurants.map((restaurant) => {
                    <p>Favorite Restaurant</p>
                })) :
                <p>You have no saved restaurants yet...</p>
            }
        </div>
    )
}

export default SavedRestaurants