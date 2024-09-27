import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import Restaurant from './Restaurant';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from '../../utils/utils';
import styles from '../../styles/RestaurantForm.module.css';
import { useRedirect } from '../../hooks/useRedirect';

const RestaurantList = () => {
  useRedirect('loggedOut');
  const [restaurants, setRestaurants] = useState({ results: [] });
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filters, setFilters] = useState({
    cuisine_type: [],
    dish__dietary_preference: [],
  });
  const cuisineTypes = [
    "italian",
    "indian",
    "german",
    "japanese",
    "chinese",
    "thai",
    "mexican",
    "greek",
    "french",
    "spanish",
    "vietnamese",
    "korean",
    "other",
  ];

  const dietaryPreferences = [
    "vegetarian",
    "vegan",
    "pescatarian",
    "gluten-free",
    "halal",
    "kosher",
    "other",
  ];

  const resetFilters = () => {
    setFilters({
      cuisine_type: [],
      dish__dietary_preference: [],
    });
    setQuery("");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => {
      return { ...prevFilters, [filterName]: [value] };
    });
  };

  useEffect(() => {
    if (pathname === '/myrestaurants'){
      
    }
    setHasLoaded(false);
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams();
        if (pathname === '/myrestaurants' && currentUser?.username) {
          params.append('created_by__username', currentUser.username);
        }

        for (const filterKey in filters) {
          const filterValue = filters[filterKey];
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            filterValue.forEach(value => params.append(filterKey, value));
          } else if (filterValue) {
            params.append(filterKey, filterValue);
          }
        }

        if (query) {
          params.append('search', query);
        }
        const { data } = await axiosReq.get(`/restaurants/?${params.toString()}`);
        setRestaurants(data);
        setHasLoaded(true);
      } catch (err) {

      }
    };
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filters, pathname, query, currentUser]);

  return (
    <>
      <Row>
        <Col md={8} className='order-2'>
          {pathname === "/" ?
            <h2 className='text-center'>All Restaurants</h2>
            :
            <h2 className='text-center'>My Restaurants</h2>}
          {hasLoaded ?
            (restaurants?.results.length ? 
            (<InfiniteScroll
              children={restaurants?.results.map(restaurant => (
                <Restaurant key={restaurant.id} {...restaurant} />
              ))}
              dataLength={restaurants?.results.length}
              loader={<Asset />}
              hasMore={!!restaurants.next}
              next={() => fetchMoreData(restaurants, setRestaurants)}
            />) : 
              (pathname === "/" ? 
                <p className='text-center'>
                  <strong>No restaurants fulfilling your criteria where added yet ...</strong>
                </p> 
                : 
                <p className='text-center'>
                  <strong>You didn't add any restaurants yet or you're filtering for something you didn't create yet ...</strong>
                </p>
              )
            )
            : <Asset message="loading..." />
          }
        </Col>
        <Col className={`${styles.MarginTop}`} md={4}>
          <div className={styles.Form}>
            <h3>Search & Filter</h3>
            <Form
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Label className={styles.Bold}>Search</Form.Label>
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="search posts"
              />
            </Form>
            <Form>
              <Form.Group>
                <Form.Label className={styles.Bold}>Cuisine Types</Form.Label>
                {cuisineTypes.map((cuisine) => (
                  <Form.Check
                    key={cuisine}
                    type="radio"
                    label={cuisine}
                    checked={filters.cuisine_type.includes(cuisine)}
                    onChange={() => handleFilterChange('cuisine_type', cuisine)}
                  />
                ))}
              </Form.Group>
              <Form.Group>
                <Form.Label className={styles.Bold}>Dietary Preferences</Form.Label>
                {dietaryPreferences.map((preference) => (
                  <Form.Check
                    key={preference}
                    type="radio"
                    label={preference}
                    checked={filters.dish__dietary_preference.includes(preference)}
                    onChange={() => handleFilterChange('dish__dietary_preference', preference)}
                  />
                ))}
              </Form.Group>
              <Button variant='primary' onClick={() => resetFilters()}>Reset Filters</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default RestaurantList