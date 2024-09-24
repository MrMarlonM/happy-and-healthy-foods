import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import SavedRestaurants from '../../components/SavedRestaurants';
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from '../../utils/utils';

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
      <Row> 
        <Col md={8}>
        {pathname === "/" ? 
          <h2 className='text-center'>All Restaurants</h2>
          : 
          <h2 className='text-center'>My Restaurants</h2>}
        {hasLoaded ?
          <InfiniteScroll
            children={restaurants?.results.map(restaurant => (
              <Restaurant key={restaurant.id} {...restaurant} />
            ))}
            dataLength={restaurants?.results.length}
            loader={<Asset/>}
            hasMore={!!restaurants.next}
            next={() => fetchMoreData(restaurants, setRestaurants)}
          />
           : <Asset message="loading..."/>
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