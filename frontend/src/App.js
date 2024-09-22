import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import RestaurantCreateForm from './pages/restaurants/RestaurantCreateForm';
import RestaurantPage from './pages/restaurants/RestaurantPage';
import RestaurantList from './pages/restaurants/RestaurantList';
import { useCurrentUser } from './contexts/CurrentUserContext';

function App() {
  const currentUser = useCurrentUser();
  const username = currentUser?.username || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path='/' render={() => <RestaurantList/>} />
          <Route exact path='/myrestaurants' render={() => <RestaurantList filter={`created_by__username=${username}`}/>} />
          <Route exact path='/signin' render={() => <SignInForm />} />
          <Route exact path='/signup' render={() => <SignUpForm />} />
          <Route exact path ='/create' render={() => <RestaurantCreateForm/>} />
          <Route exact path='/restaurants/:id' render={() => <RestaurantPage/>} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
