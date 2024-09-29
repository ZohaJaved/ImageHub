import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const verifySession = () => {
            const user = localStorage.getItem('user');
            console.log("Retrieved user from localStorage:", user);
            if (user) {
                setLoggedIn(true);
                console.log("User is logged in");
            } else {
                setLoggedIn(false);
                console.log("User is not logged in");
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    //it will take some time while session is being verified
    if (loading) {
        return <div>Loading...</div>; 
    }

    console.log("loggedIn", loggedIn);
    return loggedIn ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
