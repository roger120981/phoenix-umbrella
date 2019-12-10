defmodule Startpage.Repo.Migrations.CreateFolders do
  use Ecto.Migration

  def change do
    create table(:folders) do
      add :name, :text, null: false
      add :theme, :text, null: false
      add :order, :integer, null: false
      add :content, :text

      timestamps()
    end

  end
end
