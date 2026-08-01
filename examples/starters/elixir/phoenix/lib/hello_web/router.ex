defmodule HelloWeb.Router do
  use HelloWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", HelloWeb do
    pipe_through :api

    get "/", PageController, :home
    get "/health", PageController, :health
  end
end
