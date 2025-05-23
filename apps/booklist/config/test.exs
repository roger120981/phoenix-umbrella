import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :booklist, BooklistWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Configure your database
config :booklist, ecto_repos: [Grenadier.Repo]
# config :booklist, Booklist.Repo,
#   username: "postgres",
#   password: "postgres",
#   database: "booklist_test",
#   hostname: "localhost",
#   pool: Ecto.Adapters.SQL.Sandbox
