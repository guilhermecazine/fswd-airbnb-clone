json.total_pages @properties.total_pages
json.next_page @properties.next_page

json.properties do
  json.array! @properties do |property|
    json.id property.id
    json.title property.title
    json.city property.city
    json.country property.country
    json.property_type property.property_type
    json.price_per_night property.price_per_night
    
    json.images do
      json.array! property.images do |image|
        json.url url_for(image) if property.images.attached?
      end
    end


    json.user do
      json.id property.user.id
      json.username property.user.username
    end
  end
end