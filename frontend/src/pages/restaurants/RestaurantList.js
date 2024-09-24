import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import SavedRestaurants from '../../components/SavedRestaurants';
import Asset from "../../components/Asset";

const RestaurantList = ({ filter = "" }) => {
  const [restaurants, setRestaurants] = useState({ results: [] });
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);


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
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 500)
    return () => {
      clearTimeout(timer);
    }
  }, [filter, pathname, query, currentUser])

  return (
    <>
      {pathname === "/" ? <h2>Restaurants</h2> : <h2>My Restaurants</h2>}
      <Row> 
        <Col md={8}>
        {hasLoaded ?
          (restaurants?.results.map(restaurant => (
            <Restaurant key={restaurant.id} {...restaurant} />
          ))) : <Asset message="loading..."/>
          }
        </Col>
        <Col md={4}>
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
          <div>
            <h3>Filters</h3>
          </div>
          {currentUser && <div>
            <SavedRestaurants currentUser={currentUser} />
          </div>}
        </Col>
      </Row>
    </>
  )
}

export default RestaurantList