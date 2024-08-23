module Api
  class PropertiesController < ApplicationController
    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if !@properties

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      render 'api/properties/show', status: :ok
    end

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      user = session.user

      @property = user.properties.new(property_params)

      if @property.save
        render 'api/properties/create', status: :created
      else
        render json: { error: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      user = session.user

      @property = user.properties.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      if @property.update(property_params)
        render 'api/properties/update', status: :ok
      else
        render json: { error: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      user = session.user

      @property = user.properties.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      @property.destroy
      render json: { message: 'Property successfully deleted' }, status: :ok
    end

    private
    
    def property_params
      params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, images: [])
    end
  end
end