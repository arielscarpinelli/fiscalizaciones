/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getMesas, deleteMesa } from "api/modules/mesas.api";

const ListMesas = () => {
  const [mesas, setMesas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    setLoading(true);
    setMesas([]);
    try {
      const response = await getMesas();
      setMesas(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener las mesas");
    } finally {
      setLoading(false);
    }
  };

  const removeMesa = async (mesa) => {
    if (
      confirm(
        `¿Deseas eliminar al mesa ${mesa.name}?`
      )
    ) {
      try {
        await deleteMesa(mesa.id);
        toast.info("La mesa ha sido eliminado exitosamente");
        history.push("/sistema/mesas");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la mesa");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Mesas</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchMesas}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="mesas/crear"
            >
              Registrar mesa
            </Link>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header">Listado de mesas</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Escuela</th>
                    <th scope="col">Numero</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((mesa) => (
                    <tr key={mesa.id}>
                      <td>
                        {mesa.escuela_.nombre}
                      </td>
                      <td>
                        {mesa.codigo}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`mesas/${mesa.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeMesa(mesa)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ListMesas;
