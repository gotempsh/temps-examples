require_relative "boot"

require "rails"
require "action_controller/railtie"

module TempsRailsExample
  class Application < Rails::Application
    config.load_defaults 8.0

    # API-only keeps the example free of an asset pipeline.
    config.api_only = true
    config.eager_load = true

    # Real apps read this from credentials; the fallback exists so
    # `docker run` with no configuration still boots.
    config.secret_key_base = ENV.fetch("SECRET_KEY_BASE", "temps-demo-secret-key-base")

    config.hosts.clear
    config.logger = Logger.new($stdout)
  end
end
