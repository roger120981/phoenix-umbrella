defmodule PluginistaWeb.MakerController do
  use PluginistaWeb, :controller

  alias Pluginista.Admin
  alias Pluginista.Admin.Maker

  def index(conn, _params) do
    makers = Admin.list_makers()
    render(conn, "index.html", makers: makers)
  end

  def new(conn, _params) do
    changeset = Admin.change_maker(%Maker{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"maker" => maker_params}) do
    case Admin.create_maker(maker_params) do
      {:ok, maker} ->
        conn
        |> put_flash(:info, "Maker created successfully.")
        |> redirect(to: Routes.maker_path(conn, :show, maker))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    maker = Admin.get_maker!(id)
    render(conn, "show.html", maker: maker)
  end

  def edit(conn, %{"id" => id}) do
    maker = Admin.get_maker!(id)
    changeset = Admin.change_maker(maker)
    render(conn, "edit.html", maker: maker, changeset: changeset)
  end

  def update(conn, %{"id" => id, "maker" => maker_params}) do
    maker = Admin.get_maker!(id)

    case Admin.update_maker(maker, maker_params) do
      {:ok, maker} ->
        conn
        |> put_flash(:info, "Maker updated successfully.")
        |> redirect(to: Routes.maker_path(conn, :show, maker))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", maker: maker, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    maker = Admin.get_maker!(id)
    {:ok, _maker} = Admin.delete_maker(maker)

    conn
    |> put_flash(:info, "Maker deleted successfully.")
    |> redirect(to: Routes.maker_path(conn, :index))
  end
end
