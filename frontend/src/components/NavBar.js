import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const NavBar = () => {
    const currentUser = useCurrentUser();
    const loggedInNav = (<>{currentUser?.username}</>)
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