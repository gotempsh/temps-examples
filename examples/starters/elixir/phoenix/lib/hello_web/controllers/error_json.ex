defmodule HelloWeb.ErrorJSON do
  @moduledoc """
  Renders errors as JSON. Referenced by `render_errors` in config.exs, so it
  must exist even when nothing ever fails.
  """

  def render(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end
end
