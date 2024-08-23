class StaticPagesController < ApplicationController
  def home
    render 'home'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end

  def login
    render 'login'
  end

  def host_property
    render 'host_property'
  end

  def bookings
    render 'bookings'
  end

  def success
    @data = { booking_id: params[:id] }.to_json
    render 'success'
  end
end