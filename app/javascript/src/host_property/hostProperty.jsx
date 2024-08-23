import React from 'react';
import Layout from '@src/layout';
import { handleErrors, safeCredentialsForm } from '@utils/fetchHelper';
import PropertyForm from '../propertyForm';

import './hostProperty.scss';

class HostProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {
        title: '',
        description: '',
        price_per_night: 1,
        city: '',
        country: '',
        property_type: '',
        max_guests: 1,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        images: [],
      },
      authenticated: false,
      loading: true,
      previewImage: null,
      completeForm: false,
    };
  }

  componentDidMount() {
    // Check if user is authenticated
    fetch('/api/authenticated')
      .then(handleErrors)
      .then((data) => {
        this.setState({
          authenticated: data.authenticated,
          loading: false,
        });
      });
  }

  handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // handle image input
    if (type === 'file') {
      this.setState(
        (prevState) => ({
          property: {
            ...prevState.property,
            images: e.target.files,
          },
          previewImage: URL.createObjectURL(e.target.files[0]),
        }),
        () => this.checkFormCompletion()
      );
    } else {
      // handle text/number input
      this.setState(
        (prevState) => ({
          property: {
            ...prevState.property,
            [name]: name === 'price_per_night' ? parseFloat(value) : value,
          },
        }),
        () => this.checkFormCompletion()
      );
    }
  };

  // check if all fields are filled
  checkFormCompletion = () => {
    const { property } = this.state;
    const completeForm = Object.values(property).every((value) => value !== '' && value !== 0 && value.length !== 0);
    this.setState({ completeForm });
  };

  // handle create form submission
  handleSubmit = (e) => {
    e.preventDefault();
    const { property } = this.state;
    var formData = new FormData();

    // loop through property object and append to formData
    Object.keys(property).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < property[key].length; i++) {
          formData.append(`property[${key}][]`, property[key][i]);
        }
      } else {
        formData.set(`property[${key}]`, property[key]);
      }
    });

    // post property
    fetch(
      '/api/properties',
      safeCredentialsForm({
        method: 'POST',
        body: formData,
      })
    )
      .then(handleErrors)
      .then((response) => {
        console.log(response);
        // redirect to the home page
        window.location.href = '/';
      });
  };

  render() {
    // if user is not authenticated, show a message to log in
    if (!this.state.authenticated) {
      return (
        <Layout>
          <div className='border p-4 mb-4'>
            Please <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a> to host a property.
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <h1 className='text-center my-3'>Airbnb Your Property</h1>
              <PropertyForm
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                property={this.state.property}
                formType='create'
                previewImage={this.state.previewImage}
                changedFields={[]}
                completeForm={this.state.completeForm}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default HostProperty;