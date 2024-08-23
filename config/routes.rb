Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/host_property' => 'static_pages#host_property'
  get '/bookings' => 'static_pages#bookings'
  get '/booking/:id/success' => 'static_pages#success'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: %i[create]
    resources :properties, only: [:index, :show, :create, :update, :destroy]
    resources :bookings, only: [:show, :create]
    resources :charges, only: [:create]

    delete '/logout' => 'sessions#destroy'
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'
    get '/users/:username/bookings' => 'bookings#get_user_bookings'
    get '/users/:username/property_bookings' => 'bookings#get_user_properties_bookings'

    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end