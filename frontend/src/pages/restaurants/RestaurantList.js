import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState({ results: [] });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axiosReq.get(`/restaurants/`);
                setRestaurants(data);
            } catch (err) {
                console.log(err)
            }
        }
        fetchRestaurants();
    }, [])

    return (
        <>
            {restaurants?.results.map(restaurant => (
                <Restaurant key={restaurant.id} {...restaurant}/>
            ))}
        </>
    )
}

export default RestaurantList