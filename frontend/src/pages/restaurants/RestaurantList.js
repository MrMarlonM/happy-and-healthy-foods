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

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState({ results: [] });
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filters, setFilters] = useState({
    cuisine_type: [],
    dish__dietary_preference: [],
  })
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
  ]

  const dietaryPreferences = [
    "vegetarian",
    "vegan",
    "pescatarian",
    "gluten-free",
    "halal",
    "kosher",
    "other",
  ]

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[filterName].includes(value)
        ? prevFilters[filterName].filter((item) => item !== value)
        : [...prevFilters[filterName], value];

      return { ...prevFilters, [filterName]: updatedValues };
    });
  };

  useEffect(() => {
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
        console.log(err);
      }
    };
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 500)
    return () => {
      clearTimeout(timer);
    }
  }, [filters, pathname, query, currentUser])

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
              loader={<Asset />}
              hasMore={!!restaurants.next}
              next={() => fetchMoreData(restaurants, setRestaurants)}
            />
            : <Asset message="loading..." />
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
            <Form>
              <Form.Group>
                <Form.Label>Cuisine Types</Form.Label>
                {cuisineTypes.map((cuisine) => (
                  <Form.Check
                    key={cuisine}
                    type="checkbox"
                    label={cuisine}
                    checked={filters.cuisine_type.includes(cuisine)}
                    onChange={() => handleFilterChange('cuisine_type', cuisine)}
                  />
                ))}
              </Form.Group>
              <Form.Group>
                <Form.Label>Dietary Preferences</Form.Label>
                {dietaryPreferences.map((preference) => (
                  <Form.Check
                    key={preference}
                    type="checkbox"
                    label={preference}
                    checked={filters.dish__dietary_preference.includes(preference)}
                    onChange={() => handleFilterChange('dish__dietary_preference', preference)}
                  />
                ))}
              </Form.Group>
            </Form>
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