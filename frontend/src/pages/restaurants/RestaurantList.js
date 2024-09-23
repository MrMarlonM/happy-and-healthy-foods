import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Row, Col } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import SavedRestaurants from '../../components/SavedRestaurants';

const RestaurantList = ({ filter = "" }) => {
  const [restaurants, setRestaurants] = useState({ results: [] });
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();


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
      <Row>
        <Col md={8}>
          {restaurants?.results.map(restaurant => (
            <Restaurant key={restaurant.id} {...restaurant} />
          ))}
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