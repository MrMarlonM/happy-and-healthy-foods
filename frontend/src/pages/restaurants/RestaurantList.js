import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const RestaurantList = ({filter=""}) => {
    const [restaurants, setRestaurants] = useState({ results: [] });
    const {pathname} = useLocation();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axiosReq.get(`/restaurants/?${filter}`);
                setRestaurants(data);
            } catch (err) {
                console.log(err)
            }
        }
        fetchRestaurants();
    }, [filter, pathname])

    return (
        <>
            {restaurants?.results.map(restaurant => (
                <Restaurant key={restaurant.id} {...restaurant}/>
            ))}
        </>
    )
}

export default RestaurantList