import React from 'react';

const PropertyForm = ({
  handleInputChange,
  handleSubmit,
  property,
  formType,
  previewImage,
  changedFields,
  completeForm,
}) => {
  // Get image previews
  const getImagePreviews = () => {
    // If no images and formType is create, return null
    if (property.images.length === 0 && formType === 'create') {
      return null;
    }

    // If images exist, return image url(s)
    let imagesArray = Array.from(property.images);
    return imagesArray.map((image, i) => {
      return formType === 'create' || changedFields.includes('images') ? URL.createObjectURL(image) : image.url;
    });
  };

  return (
    <form className='row g-2 d-flex justify-content-center' onSubmit={handleSubmit}>
      {/* Title */}
      <div className='col-10 text-center mb-2'>
        <label htmlFor='inputTitle' className='form-label'>
          Property Title
        </label>
        <input
          id='inputTitle'
          type='text'
          name='title'
          placeholder=''
          className={`form-control text-center bg-light ${changedFields.includes('title') ? 'bg-warning' : ''}`}
          onChange={handleInputChange}
          value={property.title}
        />
      </div>
      {/* Description */}
      <div className='col-10 text-center mb-2'>
        <label htmlFor='inputDescription' className='form-label'>
          Description
        </label>
        <textarea
          id='inputDescription'
          name='description'
          className={`form-control text-center bg-light ${changedFields.includes('description') ? 'bg-warning' : ''}`}
          placeholder=''
          onChange={handleInputChange}
          value={property.description}
        ></textarea>
      </div>
      {/* Property Type */}
      <div className='col-10 text-center mb-2'>
        <label htmlFor='inputType' className='form-label'>
          Property Type
        </label>
        <input
          id='inputType'
          type='text'
          name='property_type'
          placeholder=''
          className={`form-control text-center bg-light ${changedFields.includes('property_type') ? 'bg-warning' : ''}`}
          onChange={handleInputChange}
          value={property.property_type}
        />
      </div>
      {/* City */}
      <div className='row justify-content-center text-center mt-4'>
        <div className='col-4'>
          <input
            type='text'
            name='city'
            placeholder='City'
            className={`form-control text-center bg-light ${changedFields.includes('city') ? 'bg-warning' : ''}`}
            onChange={handleInputChange}
            value={property.city}
          />
        </div>
        {/* Country */}
        <div className='col-4'>
          <input
            type='text'
            name='country'
            placeholder='Country'
            className={`form-control text-center bg-light ${changedFields.includes('country') ? 'bg-warning' : ''}`}
            onChange={handleInputChange}
            value={property.country}
          />
        </div>
      </div>
      {/* Price and Guests */}
      <div className='row justify-content-center text-center mt-4'>
        <div className='col-3 me-3'>
          <label htmlFor='inputPrice' className='form-label'>
            Price <small>(per night)</small>
          </label>
          <input
            type='number'
            name='price_per_night'
            placeholder='$'
            className={`form-control text-center bg-light ${
              changedFields.includes('price_per_night') ? 'bg-warning' : ''
            }`}
            onChange={handleInputChange}
            value={property.price_per_night}
          />
        </div>
        <div className='col-3 ms-3'>
          <label htmlFor='inputGuests' className='form-label'>
            Max Guests
          </label>
          <select
            className={`form-select bg-light ${changedFields.includes('max_guests') ? 'bg-warning' : ''}`}
            name='max_guests'
            id='inputGuests'
            onChange={handleInputChange}
            value={property.max_guests}
          >
            <option value={1} defaultValue>
              1
            </option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
      </div>
      {/* Rooms, Beds, Baths */}
      <div className='row justify-content-center text-center mt-4'>
        <div className='col-2'>
          <label htmlFor='inputRooms' className='form-label'>
            Rooms
          </label>
          <select
            className={`form-select bg-light ${changedFields.includes('bedrooms') ? 'bg-warning' : ''}`}
            name='bedrooms'
            id='inputRooms'
            onChange={handleInputChange}
            value={property.bedrooms}
          >
            <option value={1} defaultValue>
              1
            </option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
        <div className='col-2'>
          <label htmlFor='inputRooms' className='form-label'>
            Beds
          </label>
          <select
            className={`form-select bg-light ${changedFields.includes('beds') ? 'bg-warning' : ''}`}
            name='beds'
            id='inputBeds'
            onChange={handleInputChange}
            value={property.beds}
          >
            <option value={1} defaultValue>
              1
            </option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
        <div className='col-2'>
          <label htmlFor='inputRooms' className='form-label'>
            Baths
          </label>
          <select
            className={`form-select bg-light ${changedFields.includes('baths') ? 'bg-warning' : ''}`}
            name='baths'
            id='inputBaths'
            onChange={handleInputChange}
            value={property.baths}
          >
            <option value={1} defaultValue>
              1
            </option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
      </div>
      {/* Image previews */}
      <div className='col-10 mt-4 d-flex justify-content-center gap-2'>
        {(() => {
          let imgs = getImagePreviews();
          if (imgs === null) {
            return null;
          }
          return imgs.map((img, index) => {
            return (
              <div
                key={index}
                className='property-image mb-1 rounded me-1'
                style={{
                  backgroundImage: `url(${img})`,
                  width: `${formType === 'create' ? '400px' : '250px'}`,
                  height: `${formType === 'create' ? '300px' : '150px'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            );
          });
        })()}
      </div>
      {/* Image Upload */}
      <div className='col-10 mt-4'>
        <input
          type='file'
          name='images'
          accept='image/*'
          className={`form-control bg-light ${changedFields.includes('images') ? 'bg-warning' : ''}`}
          onChange={handleInputChange}
          multiple
        />
      </div>
      {/* Submit button */}
      <div className={`col-6 text-center my-4 ${formType === 'edit' ? 'd-none' : ''}`}>
        <button type='submit' className={`btn btn-warning ${!completeForm && formType === 'create' ? 'disabled' : ''}`}>
          Host Property
        </button>
      </div>
    </form>
  );
};
export default PropertyForm;