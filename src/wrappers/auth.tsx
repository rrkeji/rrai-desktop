import { Navigate, Outlet } from 'umi'

export default (props) => {

    let isLogin = false;

    if (isLogin) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}