import { Navigate, Outlet } from 'umi'

export default (props) => {

    let isLogin = true;

    if (isLogin) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}