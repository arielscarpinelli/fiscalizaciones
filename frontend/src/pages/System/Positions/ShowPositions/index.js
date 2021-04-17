/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getPositions, deletePosition } from "api/modules/positions.api";

const ShowPositions = () => {
  const [positions, setPositions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setPositions([]);
    try {
      const response = await getPositions();
      setPositions(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener las posiciones");
    } finally {
      setLoading(false);
    }
  };

  const removePosition = async (position) => {
    if (confirm(`¿Deseas eliminar la posición ${position.name}?`)) {
      try {
        await deletePosition(position.id);
        toast.info("La posición ha sido eliminada exitosamente");
        fetchPositions();
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la posición");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Posiciones</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchPositions}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="posiciones/crear"
            >
              Registrar posición
            </Link>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header">Listado de posiciones</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Jurisdicción</th>
                    <th scope="col">Tipo</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.id}>
                      <td>{position.name}</td>
                      <td>{position.jurisdiction}</td>
                      <td>{position.type}</td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`posiciones/${position.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removePosition(position)}
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

export default ShowPositions;
