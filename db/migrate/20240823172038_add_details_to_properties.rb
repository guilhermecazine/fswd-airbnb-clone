# db/migrate/xxxxxx_add_details_to_properties.rb

class AddDetailsToProperties < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :amenities, :string
    add_column :properties, :policies, :text
    add_column :properties, :neighborhood, :string
  end
end
