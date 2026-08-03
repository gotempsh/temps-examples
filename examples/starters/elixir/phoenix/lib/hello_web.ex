defmodule HelloWeb do
  @moduledoc """
  Entrypoint for the web layer. `use HelloWeb, :controller` and
  `use HelloWeb, :router` expand to the boilerplate below.
  """

  def router do
    quote do
      use Phoenix.Router, helpers: false

      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, formats: [:json]

      import Plug.Conn
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
