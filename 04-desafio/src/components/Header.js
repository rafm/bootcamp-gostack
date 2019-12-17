import React from 'react';
import './Header.css';
import user_profile from '../assets/user_profile.png';

function Header() {
    return (
        <header>
            <span className="app-name">facebook</span>
            <div className="user-profile">
                Meu perfil
                <img alt="User profile image" className="profile-icon" src={user_profile}/>
            </div>
        </header>
    );
}

export default Header;
