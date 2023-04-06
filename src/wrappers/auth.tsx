import { Navigate, Outlet } from 'umi'

import { isLogin } from '@/utils/index';

export default (props: any) => {

    let login = isLogin();

    if (login) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}