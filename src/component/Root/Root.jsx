import React from 'react';
import Footer from '../Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from '../Nav/Nav';

import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';

const Root = () => {
    const { loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div><span className="loading loading-spinner text-primary"></span>
    <span className="loading loading-spinner text-secondary"></span>
    <span className="loading loading-spinner text-accent"></span>
    <span className="loading loading-spinner text-neutral"></span>
    <span className="loading loading-spinner text-info"></span>
    <span className="loading loading-spinner text-success"></span>
    <span className="loading loading-spinner text-warning"></span>
    <span className="loading loading-spinner text-error"></span></div>;

    const isDashboard = location.pathname === '/user-home' || location.pathname === '/admin-home';

    return (
        <div className="w-full overflow-x-hidden min-h-screen flex flex-col justify-between" >
            <div>
                {!isDashboard && <Nav></Nav>}
                <Outlet></Outlet>
            </div>
            {!isDashboard && <Footer></Footer>}
        </div>
    );
};

export default Root;

