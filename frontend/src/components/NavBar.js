import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from "axios";
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import { removeTokenTimestamp } from '../utils/utils';

const NavBar = () => {
    const setCurrentUser = useSetCurrentUser();
    const currentUser = useCurrentUser();

    const { expanded, setExpanded, ref } = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            await axios.post('dj-rest-auth/logout/');
            setCurrentUser(null);
            removeTokenTimestamp();
        } catch (err) {

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
                to='/create'
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
                to='/signin'
            >
                Sign In
            </NavLink>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='/signup'
            >
                Sign Up
            </NavLink>
        </>
    );

    return (
        <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed='top'>
            <Container>
                <NavLink to='/'>
                    <Navbar.Brand className={styles.Title}>Happy and Healthy Food's</Navbar.Brand>
                </NavLink>
                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
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
            </Container>
        </Navbar>
    )
}

export default NavBar