import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import './Header.css';
import userManager from '../../utils/userManager';

const TheHeader = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = user && !user.expired
    const isAdmin = isAuthenticated && user.profile['role'] === 'Admin';
    const onLogoutButtonClick = event => {
      event.preventDefault();
      localStorage.removeItem('user');
      userManager.signoutRedirect({ id_token_hint: user.id_token });
      userManager.removeUser(); // removes the user data from sessionStorage
    };

    const HandleChangePassword = event => {
        window.location.replace(process.env.REACT_APP_IDENTITY_URL_CHANGE_PASSWORD);
    }

    const [isToggle, setisToggle] = useState(false)
    const pagename = useSelector(state => state.home.namepage)

    return (
        <div className="narbav">
            <Container id="narbav_mid">
                <div id="Home_mif">
                    <span>{pagename}</span>
                </div>
                <Dropdown 
                    isOpen={isToggle} 
                    toggle={function noRefCheck() { setisToggle(!isToggle) }}
                    className="user-dropdown"
                    >
                    <DropdownToggle caret color="btn-primary">
                        {user.profile['name']} 
                    </DropdownToggle>
                    <DropdownMenu
                    >
                        <DropdownItem onClick={HandleChangePassword}>Change Password</DropdownItem>
                        <DropdownItem id="logout" onClick={onLogoutButtonClick}>Sign out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Container>
        </div>
    )
}

export default TheHeader
