/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getEscuelas, deleteEscuela } from "api/modules/escuelas.api";
import {getDistrito, getSeccionElectoral} from "utils/geo";
import Pager from "components/Pager";
import {useQuery} from "utils/router";

const ListEscuelas = () => {
  const {page, distrito, seccion, partido, q} = useQuery();

  const [escuelas, setEscuelas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchEscuelas = async () => {
    setLoading(true);
    try {
      const response = await getEscuelas({
        page,
        distrito,
        seccion,
        partido,
        q
      });
      setEscuelas(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener las escuelas");
    } finally {
      setLoading(false);
    }
  };

  const doFetch = () => {
    fetchEscuelas();
  };

  useEffect(doFetch, [page]);

  const removeEscuela = async (escuela) => {
    if (
      confirm(
        `¿Deseas eliminar al escuela ${escuela.nombre}?`
      )
    ) {
      try {
        await deleteEscuela(escuela.id);
        toast.info("La escuela ha sido eliminado exitosamente");
        history.push("/sistema/escuelas");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la escuela");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Escuelas</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchEscuelas}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="escuelas/crear"
            >
              Registrar escuela
            </Link>
          </div>
        </div>
        <hr />
          <div className="card">
            <div className="card-header d-flex align-items-center">
              Listado de escuelas
              <Pager data={escuelas}/>
            </div>
            {isLoading ? (
                <Spinner />
            ) : (
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Distrito</th>
                    <th scope="col">Municipio</th>
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Direccion</th>
                    <th scope="col">Partido</th>
                    <th scope="col">Fiscales</th>
                    <th scope="col">Mesas</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {escuelas.map((escuela) => (
                    <tr key={escuela.id}>
                      <td>
                        {getDistrito(escuela.distrito)}
                      </td>
                      <td>
                        {getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion}
                      </td>
                      <td>
                        {escuela.codigo}
                      </td>
                      <td>
                        {escuela.nombre}
                      </td>
                      <td>
                        {escuela.direccion}
                      </td>
                      <td>
                        {escuela.partido_ ? escuela.partido_.name : escuela.partido}
                      </td>
                      <td>
                        {escuela.fiscales_count}
                      </td>
                      <td>
                        {escuela.mesas_count}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`escuelas/${escuela.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeEscuela(escuela)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
              <div className="card-footer d-flex align-items-center">
                  <Pager data={escuelas}/>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ListEscuelas;
