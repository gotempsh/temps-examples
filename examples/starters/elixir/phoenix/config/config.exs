import Config

config :hello, HelloWeb.Endpoint,
  adapter: Bandit.PhoenixAdapter,
  render_errors: [formats: [json: HelloWeb.ErrorJSON], layout: false]

config :phoenix, :json_library, Jason

config :logger, level: :info
