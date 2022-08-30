import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import Avatar from '../Avatar';
import NotifyModel from '../NotifyModel';

const Menu = () => {
    const navLinks = [
        { labels: 'Home', icon: 'home', path:'/'},
        { labels: 'Message', icon: 'near_me', path:'/message'},
        { labels: 'Discover', icon: 'explore', path:'/discover'}
    ]

    const { auth, theme, notify } = useSelector(state => state)
    const dispatch = useDispatch()
    // console.log(useLocation())
    const { pathname } = useLocation()

    const isActive = (pn) => {
        if(pn === pathname) return 'active'
    }
    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                {
                    navLinks.map((link, index) => (
                    <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                        <Link className="nav-link" to={link.path}>
                            <span className="material-icons">{link.icon}</span>
                        </Link>
                    </li>
                    ))
                }

                <li className="nav-item dropdown">
                    <span className="nav-link position-relative" role="button" data-bs-toggle="dropdown" id='navbarDropdown' aria-haspopup="true" aria-expanded="false">
                        <span className="material-icons" style={{color: notify.data.length > 0 ? 'crimson' : ''}} >
                            favorite
                        </span>
                        <span className="notify_length">{notify.data.length}</span>
                    </span>
                    <div className="dropdown-menu" aria-labelledby='navbarDropdown' style={{transform: 'translateX(66px)'}}>
                        <NotifyModel />
                    </div>
                </li>

                <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" id='navbarDropdown' aria-haspopup="true" aria-expanded="false">
                        <Avatar src={auth.user.avatar} size = "medium-avatar" />
                    </span>
                    <div className="dropdown-menu" aria-labelledby='navbarDropdown'>
                        <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>
                    
                        <label htmlFor='theme' className="dropdown-item" onClick={() => dispatch({type: GLOBALTYPES.THEME, payload: !theme})}>
                            {theme ? 'Light mode' : 'Dark mode'}
                        </label>
                        
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/" onClick={() => dispatch(logout())}>
                            Logout
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Menu;