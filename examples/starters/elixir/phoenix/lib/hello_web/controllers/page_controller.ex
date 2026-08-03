defmodule HelloWeb.PageController do
  use HelloWeb, :controller

  def home(conn, _params) do
    json(conn, %{message: "Hello from Phoenix on Temps!"})
  end

  def health(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
