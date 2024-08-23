import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './success.scss';

// Success component
const Success = ({ booking_id }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking data on mount
  useEffect(() => {
    fetch(
      `/api/bookings/${booking_id}`,
      safeCredentials({
        method: 'GET',
      })
    )
      .then(handleErrors)
      .then((response) => {
        setBooking(response.booking);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className='container pt-4'>
        <div className='row justify-content-center'>
          <div className='col-12 d-flex flex-column align-items-center gap-3'>
            <h2>{`Thank You ${booking.user.username}!`}</h2>
            <h4 className='text-center'>{`Your payment for "${booking.property.title}" is processing. Please review and save all the following information about your booking.`}</h4>
          </div>
          {/* Property image */}
          <div className='col-10 d-flex flex-column justify-content-center mt-5 mb-2'>
            {(() => {
              let image = booking.property.images[0]
                ? booking.property.images[0].url
                : `https://cdn.altcademy.com/assets/images/medium/airbnb_clone/${booking.property.property_id - 1}.jpg`;

              return <div className='property-image mb-1 rounded' style={{ backgroundImage: `url(${image})` }} />;
            })()}
            {/* Property details */}
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-text'>
                  <u className='lead'>Property</u>: <span className='fst-normal'>{booking.property.title}</span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Location</u>:{' '}
                  <span className='fst-normal'>
                    {booking.property.city}, {booking.property.country}
                  </span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Host</u>: <span className='fst-normal'>{booking.property.username}</span>
                </h5>
                <hr />
                <h5 className='card-text'>
                  <u className='lead'>Check-In</u>: <span className='fst-normal'>{booking.start_date}</span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Check-Out</u>: <span className='fst-normal'>{booking.end_date}</span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Total Cost</u>:{' '}
                  <span className='fst-normal'>${parseInt(booking.charges[0].amount)}.00</span>{' '}
                  <span>
                    <small>(${booking.property.price_per_night}/day)</small>
                  </span>
                </h5>
                <hr />
                <h5 className='card-text'>
                  <u className='lead'>Rooms</u>: <span className='fst-normal'>{booking.property.bedrooms}</span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Beds</u>: <span className='fst-normal'>{booking.property.beds}</span>
                </h5>
                <h5 className='card-text'>
                  <u className='lead'>Bathrooms</u>: <span className='fst-normal'>{booking.property.baths}</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Success;