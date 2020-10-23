defmodule Umbrella.Common.Deps do
  # Shared dependencies for phoenix projects
  def shared_phoenix_deps do
    [
      {:phoenix, "~> 1.5.4"},
      {:phoenix_pubsub, "~> 2.0"},
      ecto(),
      {:ecto_sql, "~> 3.4.5"},
      {:postgrex, "~> 0.15"},
      {:phoenix_html, "~> 2.14"},
      {:phoenix_live_reload, "~> 1.2.4", only: :dev},
      {:gettext, "~> 0.17.1"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.4.0"},
      {:common, in_umbrella: true},
      {:assertions, "~> 0.15", only: :test},
    ]
  end

  def shared_authenticated_phoenix_deps do
    shared_phoenix_deps() ++
    [
      {:grenadier, in_umbrella: true},
    ]
  end

  def ecto do
    {:phoenix_ecto, "~> 4.2"}
  end

  def http_poison do
    {:httpoison, "~> 1.7.0"}
  end

  def floki do
    {:floki, "~> 0.28.0"}
  end

  def earmark do
    {:earmark, "~> 1.4.9"}
  end

  def argon2 do
    {:argon2_elixir, "~> 2.3.0"}
  end
end
