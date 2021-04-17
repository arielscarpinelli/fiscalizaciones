/* eslint-disable no-restricted-globals */
import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "components/Spinner";

import { getUsers, deleteUser } from "api/modules/users.api";
import UserContext from "context/UserContext";

const ShowUsers = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const {
    userData: { role },
  } = useContext(UserContext);

  const isSuperAdmin = role === "SUPERADMIN";
  const isAdmin = role === "ADMIN";
  const isOperator = role === "OPERATOR";

  const rejectIfUserIsOperator = () => {
    if (isOperator) {
      toast.error("No tienes acceso a este módulo.");
      history.push("/sistema");
    }
  };

  useEffect(rejectIfUserIsOperator, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setUsers([]);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (user) => {
    if (confirm(`¿Deseas eliminar al usuario ${user.email}?`)) {
      try {
        await deleteUser(user.id);
        toast.info(`El usuario ha sido eliminado exitosamente.`);
        fetchUsers();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Usuarios</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchUsers}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="usuarios/crear"
            >
              Crear usuario
            </Link>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header">Listado de usuarios</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Rol</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="text-right">
                        {((isSuperAdmin && user.role !== "SUPERADMIN") ||
                          (isAdmin && user.role === "OPERATOR")) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeUser(user)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;
