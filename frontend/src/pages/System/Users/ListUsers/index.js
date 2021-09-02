/* eslint-disable no-restricted-globals */
import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "components/Spinner";

import { getUsers, deleteUser } from "api/modules/users.api";
import UserContext from "context/UserContext";
import {getDistrito, getSeccionElectoral} from "utils/geo";
import Pager from "components/Pager";
import {useQuery} from "utils/router";
import {SearchContext} from "utils/forms";
import TextField from "components/Forms/TextField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import SelectPartidoField from "components/Partidos/SelectPartidoField";
import SelectEscuelaField from "components/Escuelas/SelectEscuelaField";
import {useWatch} from "react-hook-form";
import SelectField from "components/Forms/SelectField";

const ListUsers = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const {name, email, role, partido, distrito, seccion, page} = useQuery();

  const {
    userData,
  } = useContext(UserContext);

  const isSuperAdmin = userData.role === "SUPERADMIN";
  const isAdmin = userData.role === "ADMIN";
  const isOperator = userData.role === "OPERATOR";

  const rejectIfUserIsOperator = () => {
    if (isOperator) {
      toast.error("No tienes acceso a este módulo.");
      history.push("/sistema");
    }
  };

  useEffect(rejectIfUserIsOperator, []);

  const doFetch = () => {
    fetchUsers();
  };

  useEffect(doFetch, [name, email, role, partido, distrito, seccion, page]);

  const fetchUsers = async () => {
    setLoading(true);
    setUsers([]);
    try {
      const response = await getUsers({ name, email, role, partido, distrito, seccion, page });
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

  const roles = [
    { value: "OPERATOR" },
    { value: "ADMIN" },
    { value: "SUPERADMIN"},
  ]

  return (
    <div className="row">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Usuarios</span>
          </div>
          <Pager data={users}/>
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
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                          label="Nombre"
                          name="name"
                          placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                          label="Email"
                          name="email"
                          placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <SelectField name="role" empty={"Filtrar"} label="Rol" options={roles}/>
                      </SearchContext>
                    </th>
                    <th scope="col" style={{width: 120}}>
                      <SearchContext>
                        <SelectPartidoField name="partido" empty={"Filtrar"} label="Partido"/>
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <SelectDistritoField name="distrito" empty={"Todos"} label="Distrito"/>
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <SelectSeccionElectoralField name="seccion" distrito={distrito} empty={"Todos"} label="Municipio"/>
                      </SearchContext>
                    </th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{(user.partido_ || {}).name}</td>
                      <td>{getDistrito(user.distrito)}</td>
                      <td>{(getSeccionElectoral(user.distrito, user.seccion_electoral) || {}).seccion}</td>
                      <td className="text-right">
                        {((isSuperAdmin && user.email !== userData.email) ||
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
                <tfoot className="card-footer">
                  <tr><td colSpan={7}><Pager data={users}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListUsers;
