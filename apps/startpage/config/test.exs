import Config

# Configure your database
# config :startpage, Startpage.Repo,
#   username: "postgres",
#   password: "postgres",
#   database: "startpage_test",
#   hostname: "localhost",
#   pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :startpage, StartpageWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warning
