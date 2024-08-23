// bookingWidget.jsx
import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

import 'react-dates/lib/css/_datepicker.css';

class BookingWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      existingBookings: [],
      startDate: null,
      endDate: null,
      focusedInput: null,
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    // Check if user is authenticated
    fetch('/api/authenticated')
      .then(handleErrors)
      .then((data) => {
        this.setState({
          authenticated: data.authenticated,
        });
      });

    this.getPropertyBookings();
  }

  // Fetch existing bookings for the property
  getPropertyBookings = () => {
    fetch(`/api/properties/${this.props.property_id}/bookings`)
      .then(handleErrors)
      .then((data) => {
        console.log(data);
        this.setState({
          existingBookings: data.bookings,
        });
      });
  };

  // Submit booking
  submitBooking = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { startDate, endDate } = this.state;
    console.log(startDate.format('MMM DD YYYY'), endDate.format('MMM DD YYYY'));

    fetch(
      `/api/bookings`,
      safeCredentials({
        method: 'POST',
        body: JSON.stringify({
          booking: {
            property_id: this.props.property_id,
            start_date: startDate.format('MMM DD YYYY'),
            end_date: endDate.format('MMM DD YYYY'),
          },
        }),
      })
    )
      .then(handleErrors)
      .then((response) => {
        console.log(response);
        return this.initiateStripeCheckout(response.booking.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // initiate stripe checkout page
  initiateStripeCheckout = (booking_id) => {
    return fetch(
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

  // Update date range
  onDatesChange = ({ startDate, endDate }) => this.setState({ startDate, endDate });

  // Update focused input
  onFocusChange = (focusedInput) => this.setState({ focusedInput });

  // Check if check-in day is blocked
  isCheckInDayBlocked = (day) =>
    this.state.existingBookings.filter((b) => day.isBetween(b.start_date, b.end_date, 'day', '[)')).length > 0;

  // Check if check-out day is blocked
  isCheckOutDayBlocked = (day) =>
    this.state.existingBookings.filter((b) => day.isBetween(b.start_date, b.end_date, 'day', '(]')).length > 0;

  render() {
    const { authenticated, startDate, endDate, focusedInput } = this.state;

    // if user is not authenticated, show a message to log in
    if (!authenticated) {
      return (
        <div className='border p-4 mb-4'>
          Please <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a> to make a booking.
        </div>
      );
    }

    const { price_per_night } = this.props;

    // determine number of days for a booking
    let days;
    if (startDate && endDate) {
      days = endDate.diff(startDate, 'days');
    }

    return (
      <div className='border p-4 mb-4'>
        <form onSubmit={this.submitBooking}>
          <h5>
            ${price_per_night} <small>per night</small>
          </h5>
          <hr />
          {/* Calendar input */}
          <div style={{ marginBottom: focusedInput ? '400px' : '2rem' }}>
            <DateRangePicker
              startDate={startDate}
              startDateId='start_date'
              endDate={endDate}
              endDateId='end_date'
              onDatesChange={this.onDatesChange}
              focusedInput={focusedInput}
              onFocusChange={this.onFocusChange}
              isDayBlocked={focusedInput === 'startDate' ? this.isCheckInDayBlocked : this.isCheckOutDayBlocked}
              numberOfMonths={1}
            />
          </div>
          {days && (
            <div className='d-flex justify-content-between'>
              <p>Total</p>
              <p>${(price_per_night * days).toLocaleString()}</p>
            </div>
          )}
          <button type='submit' className='btn btn-large btn-danger btn-block'>
            Book
          </button>
        </form>
      </div>
    );
  }
}

export default BookingWidget;