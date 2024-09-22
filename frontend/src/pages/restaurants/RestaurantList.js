import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Form } from 'react-bootstrap';

const RestaurantList = ({ filter = "" }) => {
    const [restaurants, setRestaurants] = useState({ results: [] });
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
              const params = new URLSearchParams(); 
              if (filter && filter.startsWith('created_by__username=')) {
                const username = filter.split('=')[1];
                params.append('created_by__username', username); 
              }
              if (query) {
                params.append('search', query);
              }
              const { data } = await axiosReq.get(`/restaurants/?${params.toString()}`); 
              setRestaurants(data);
            } catch (err) {
              console.log(err);
            }
          };
          fetchRestaurants();
    }, [filter, pathname, query])

    return (
        <>
            <Form
                onSubmit={(event) => event.preventDefault()}
            >
                <Form.Control
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="search posts"
                />
            </Form>
            {restaurants?.results.map(restaurant => (
                <Restaurant key={restaurant.id} {...restaurant} />
            ))}
        </>
    )
}

export default RestaurantList