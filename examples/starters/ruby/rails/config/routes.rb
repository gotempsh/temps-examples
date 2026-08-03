Rails.application.routes.draw do
  get "/" => "home#index"
  get "/health" => "home#health"
end
