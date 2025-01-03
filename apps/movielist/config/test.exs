import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :movielist, MovielistWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Configure your database
# config :movielist, Movielist.Repo,
#   username: "postgres",
#   password: "postgres",
#   database: "movielist_test",
#   hostname: "localhost",
#   pool: Ecto.Adapters.SQL.Sandbox
