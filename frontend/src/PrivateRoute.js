
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function PrivateRoute({ element, requiredRole }) {
    const jwtToken = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) return <>Loading...</>;

    if (!jwtToken) return <Navigate to="/" replace />;
    return element;
}

export default PrivateRoute;
