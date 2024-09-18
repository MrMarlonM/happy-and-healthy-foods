import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import { axios } from "axios";

const NavBar = () => {
    const setCurrentUser = useSetCurrentUser();
    const currentUser = useCurrentUser();

    const handleSignOut = async () => {
        try {
            await axios.post('dj-rest-auth/logout/');
            setCurrentUser(null);
        } catch(err) {
            console.log(err);
        };
    };

    const loggedInNav = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='/myrestaurants'
            >
                My restaurants
            </NavLink>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='addrestaurant'
            >
                Add restaurant
            </NavLink>
            <NavLink
                className={styles.NavLink}
                to='/'
                onClick={handleSignOut}
            >
                Sign out
            </NavLink>
        </>
    )
    
    const loggedOutNav = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='signin'
            >
                Sign In
            </NavLink>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='signup'
            >
                Sign Up
            </NavLink>
        </>
    );

    return (
        <Navbar className={styles.NavBar} expand="md" fixed='top'>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink
                            exact
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            Home
                        </NavLink>
                        {currentUser ? loggedInNav : loggedOutNav}
                    </Nav>
                </Navbar.Collapse>
                <NavLink to='/'>
                    <Navbar.Brand>Happy and Healthy Food's</Navbar.Brand>
                </NavLink>
            </Container>
        </Navbar>
    )
}

export default NavBar