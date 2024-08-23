import React from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

import './bookings.scss';

class Bookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      username: '',
      authenticated: false,
      show_booked_properties: true,
      loading: true,
    };
  }

  componentDidMount() {
    // Check if user is authenticated
    fetch('/api/authenticated')
      .then(handleErrors)
      .then((data) => {
        this.setState({
          username: data.username,
          authenticated: data.authenticated,
        });
      })
      .then(() => {
        // If user is authenticated, show properties
        if (this.state.authenticated) {
          this.showProperties();
        }
      });
  }

  // Fetch bookings data
  showProperties = () => {
    let endpoint = this.state.show_booked_properties ? 'bookings' : 'property_bookings';

    fetch(`/api/users/${this.state.username}/${endpoint}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          bookings: data.bookings,
          loading: false,
        });
      });
  };

  // Initiate Stripe checkout
  initiateStripeCheckout = (booking_id) => {
    fetch(
      `/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`,
      safeCredentials({
        method: 'POST',
      })
    )
      .then(handleErrors)
      .then((response) => {
        const stripe = Stripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);

        stripe
          .redirectToCheckout({
            //make id field from checkout session creation API response available to this file
            sessionId: response.charge.checkout_session_id,
          })
          .then((result) => {
            // if fails due to browser/network error, display error message
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle payment button click
  handlePayment = (e, booking_id) => {
    e.preventDefault();
    return this.initiateStripeCheckout(booking_id);
  };

  render() {
    const { bookings, loading, authenticated, show_booked_properties } = this.state;

    // If user is not authenticated, show a message to log in
    if (!authenticated) {
      return (
        <Layout>
          <div className='border p-4 mb-4'>
            Please <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a> to make a booking.
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className='container'>
          <div className='row'>
            <h1 className='text-center my-5'>Bookings</h1>
            <div className='col-12'>
              {/* Booking buttons */}
              <div className='booking-buttons d-flex justify-content-center gap-2 mb-5'>
                <button
                  className='btn btn-lg btn-primary'
                  onClick={(e) => {
                    this.setState({ show_booked_properties: true }, () => {
                      this.showProperties();
                    });
                  }}
                >
                  My Booked Properties
                </button>
                <button
                  className='btn btn-lg btn-primary'
                  onClick={(e) => {
                    this.setState({ show_booked_properties: false }, () => {
                      this.showProperties();
                    });
                  }}
                >
                  My Property Bookings
                </button>
              </div>
              {bookings.length === 0 && authenticated && <h1 className='text-center'>No Bookings</h1>}
              {/* Bookings table */}
              <div className={`table-responsive ${bookings.length === 0 || !authenticated ? 'd-none' : ''}`}>
                <table className='table table-striped table-hover table-bordered align-items-center'>
                  <thead>
                    <tr className='align-middle text-center'>
                      <th></th>
                      <th>Property</th>
                      <th>{show_booked_properties ? 'Host' : 'Renter'}</th>
                      <th>Price</th>
                      {show_booked_properties && (
                        <>
                          <th>Rooms</th>
                          <th>Beds</th>
                          <th>Baths</th>
                        </>
                      )}
                      <th>Check In - Check Out</th>
                      <th>Paid?</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (loading) {
                        return (
                          <tr className='align-middle text-center'>
                            <td>loading...</td>
                          </tr>
                        );
                      }
                      if (bookings.length === 0) {
                        return (
                          <tr className='align-middle text-center'>
                            <td>No bookings</td>
                          </tr>
                        );
                      }
                      // Display bookings
                      return bookings.map((booking) => {
                        let image = booking.property.images[0]
                          ? booking.property.images[0].url
                          : `https://cdn.altcademy.com/assets/images/medium/airbnb_clone/${
                              booking.property.property_id - 1
                            }.jpg`;

                        let days = Math.floor(
                          (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <tr className='align-middle text-center' key={booking.id}>
                            {/* Property image and link */}
                            <td>
                              <a
                                href={`/property/${booking.property.property_id}`}
                                className='text-body text-decoration-none'
                              >
                                <div
                                  className='property-image mb-1 rounded'
                                  style={{
                                    backgroundImage: `url(${image})`,
                                    width: '75px',
                                    height: '75px',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'no-repeat',
                                  }}
                                />
                              </a>
                            </td>
                            {/* Property title */}
                            <td>{booking.property.title}</td>
                            {/* Username */}
                            <td>
                              {this.state.show_booked_properties ? booking.property.username : booking.user.username}
                            </td>
                            {/* Price */}
                            <td>
                              ${booking.property.price_per_night * days}{' '}
                              <small className='fw-light fst-italic'>(${booking.property.price_per_night}/day)</small>
                            </td>
                            {/* Rooms, beds and baths */}
                            {show_booked_properties && (
                              <>
                                <td>{booking.property.bedrooms}</td>
                                <td>{booking.property.beds}</td>
                                <td>{booking.property.baths}</td>
                              </>
                            )}
                            {/* Check In and Check Out Dates */}
                            <td>
                              <span>{booking.start_date}</span>
                              <span className='fs-4'> - </span>
                              <span>{booking.end_date}</span>
                            </td>
                            {/* Payment status */}
                            {(() => {
                              if (!show_booked_properties) {
                                return <td>{booking.paid ? 'Yes' : 'No'}</td>;
                              }
                              return (
                                <td>
                                  {booking.paid ? (
                                    'Yes'
                                  ) : (
                                    <div className='d-flex flex-column align-items-center'>
                                      <small className=''>No</small>
                                      <button
                                        className='btn btn-sm btn-warning mt-1'
                                        onClick={(e) => this.handlePayment(e, booking.id)}
                                      >
                                        <small>Finish Payment</small>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              );
                            })()}
                            {/* <td>
                              <button className='btn btn-danger'>Cancel</button>
                            </td> */}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Bookings;