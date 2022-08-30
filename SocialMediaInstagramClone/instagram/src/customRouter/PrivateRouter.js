import { Outlet, Navigate } from 'react-router-dom';

const PrivateRouter = (props) => {
    const firstLogin = localStorage.getItem('firstLogin')
    return firstLogin ? <Outlet {...props} /> : <Navigate to="/" />
};

export default PrivateRouter;