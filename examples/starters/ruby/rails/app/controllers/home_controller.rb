class HomeController < ApplicationController
  def index
    render json: { message: "Hello from Ruby on Rails on Temps!" }
  end

  def health
    render json: { status: "ok" }
  end
end
