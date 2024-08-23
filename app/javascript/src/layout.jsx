import React from 'react';
import { useState, useEffect } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

const Layout = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    fetch(
      '/api/authenticated',
      safeCredentials({
        method: 'GET',
      })
    )
      .then(handleErrors)
      .then((response) => {
        setLoggedIn(true);
      });
  }, []);

  // Handle user logout
  const handleLogout = (e) => {
    e.preventDefault();

    fetch(
      '/api/logout',
      safeCredentials({
        method: 'DELETE',
      })
    )
      .then(handleErrors)
      .then((response) => {
        setLoggedIn(false);
        window.location.href = '/';
      });
  };

  return (
    <>
      <nav className='navbar navbar-expand navbar-light bg-light'>
        <div className='container-fluid'>
          <a href='/' className='navbar-brand text-danger'>
            Airbnb
          </a>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto'>
              <li className='nav-item'>
                <a href='/' className='nav-link'>
                  Home
                </a>
              </li>
              <li className='nav-item'>
                <a href='/host_property' className='nav-link'>
                  Host Property
                </a>
              </li>
              <li className='nav-item'>
                <a href='/bookings' className='nav-link'>
                  Bookings
                </a>
              </li>
              <li className='nav-item'>
                {loggedIn ? (
                  <a href='#' className='nav-link' onClick={handleLogout}>
                    Log Out
                  </a>
                ) : (
                  <a href='/login' className='nav-link'>
                    Log In
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {props.children}
      <footer className='p-3 bg-light'>
        <div>
          <p className='me-3 mb-0 text-secondary'>Airbnb Clone</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;