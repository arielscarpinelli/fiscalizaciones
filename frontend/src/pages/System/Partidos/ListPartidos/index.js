/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getPartidos, deletePartido } from "api/modules/partidos.api";
import Pager from "components/Pager";

const ListPartidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchPartidos();
  }, []);

  const fetchPartidos = async () => {
    setLoading(true);
    setPartidos([]);
    try {
      const response = await getPartidos();
      setPartidos(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener los partidos");
    } finally {
      setLoading(false);
    }
  };

  const removePartido = async (partido) => {
    if (
      confirm(
        `¿Deseas eliminar al partido ${partido.name}?`
      )
    ) {
      try {
        await deletePartido(partido.id);
        toast.info("El partido ha sido eliminado exitosamente");
        history.push("/sistema/partidos");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el partido");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Partidos</span>
          </div>
          <Pager data={partidos}/>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchPartidos}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="partidos/crear"
            >
              Registrar partido
            </Link>
          </div>
        </div>
        <hr />
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : partidos.map((partido) => (
                    <tr key={partido.id}>
                      <td>
                        {partido.name}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`partidos/${partido.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removePartido(partido)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="card-footer">
                  <tr><td colSpan={2}><Pager data={partidos}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListPartidos;
