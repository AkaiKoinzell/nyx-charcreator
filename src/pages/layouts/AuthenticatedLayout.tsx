import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { jwtSelector } from "../../store/auth/auth-slice";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getToken } from "../../store/auth/auth-thunk";

export const AuthenticatedLayout = () => {
    const dispatch = useAppDispatch()
    dispatch(getToken())
    const jwt = useAppSelector(jwtSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if(!jwt) {
            navigate("/");
        }
    }, [jwt, navigate]);

    return (
        <>
            <Outlet />
        </>
    );
};
