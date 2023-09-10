import { useLoaderData } from "react-router-dom";
import { LoaderData } from "../../models/auth/LoaderData";
import { useAppDispatch } from "../../hooks/redux";
import { setAuthenticationState } from "../../store/auth/auth-slice";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const loaderData = useLoaderData() as LoaderData<any>;
    const dispatch = useAppDispatch();
    dispatch(setAuthenticationState(!!loaderData.jwt));
    return <>{children}</>;
};
