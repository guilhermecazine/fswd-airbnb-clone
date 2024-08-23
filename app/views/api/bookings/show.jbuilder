json.booking do
    json.id @booking.id
    json.start_date @booking.start_date
    json.end_date @booking.end_date
    json.paid @booking.is_paid?

    json.user do
      json.username @booking.user.username
    end

    json.charges do
      json.array! @booking.charges do |charge|
        json.id charge.id
        json.amount charge.amount
      end
    end

    json.property do
      json.property_id @booking.property.id
      json.title @booking.property.title
      json.city @booking.property.city
      json.country @booking.property.country
      json.price_per_night @booking.property.price_per_night
      json.bedrooms @booking.property.bedrooms
      json.beds @booking.property.beds
      json.baths @booking.property.baths
      json.username @booking.property.user.username
      json.images do
        json.array! @booking.property.images do |image|
          json.url url_for(image) if @booking.property.images.attached?
        end
      end
    end
end