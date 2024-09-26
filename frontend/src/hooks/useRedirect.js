import axios from "axios";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min"

export const useRedirect = (userAuthStatus) => {
    const history = useHistory();
    const {pathname} = useLocation();
    
    useEffect(() => {
        const handleMount = async () => {
            try {
                await axios.post('/dj-rest-auth/token/refresh/')
                if (userAuthStatus === 'loggedIn') {
                    history.push('/');
                }
            } catch(err) {
                if (userAuthStatus === 'loggedOut' || pathname === '/myrestaurant') {
                    history.push('/');
                }
            }
        };
        handleMount();
    }, [history, userAuthStatus, pathname]);
}