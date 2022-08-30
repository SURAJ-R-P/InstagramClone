import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Search from './Search'

const Header = () => {
    return (
        <div className='header bg-light'>
            <nav className="navbar navbar-expand-lg bg-light navbar-light justify-content-between align-middle">
                    <Link to="/" className='logo' style={{textDecoration:"none"}}>
                        <h1 className="navbar-brand text-uppercase p-0 m-0" 
                        style={{background:"linear-gradient(to left,#405DE6,#5851D8,#833AB4,#C13584,#E1306C,#FD1D1D,#F56040,#F77737,#FCAF45,#FFDC80,#FFFFFF)", 
                        color:"transparent",WebkitBackgroundClip:"text", fontFamily:"Fira Sans sans-serif", fontSize:"30px", fontWeight:"900", WebkitTextStroke:"0.5px black"}}
                        onClick={() => window.scrollTo({top: 0})}>
                            InstaChat
                        </h1>
                    </Link>
                    
                    <Search /> 

                    <Menu />
            </nav>
        </div>
    );
};

export default Header;