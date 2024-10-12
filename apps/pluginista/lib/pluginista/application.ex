defmodule Pluginista.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      # Pluginista.Repo,
      # Start the Telemetry supervisor
      PluginistaWeb.Telemetry,
      # Start the Endpoint (http/https)
      PluginistaWeb.Endpoint
      # Start a worker by calling: Pluginista.Worker.start_link(arg)
      # {Pluginista.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pluginista.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PluginistaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
