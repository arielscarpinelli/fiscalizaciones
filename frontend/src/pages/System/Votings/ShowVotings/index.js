/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getVotings, deleteVoting } from "api/modules/votings.api";

const ShowVotings = () => {
  const [votings, setVotings] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setVotings([]);
    try {
      const response = await getVotings();
      setVotings(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener las votaciones");
    } finally {
      setLoading(false);
    }
  };

  const removeVoting = async (voting) => {
    if (confirm(`¿Deseas eliminar la votación ${voting.name}?`)) {
      try {
        await deleteVoting(voting.id);
        toast.info("La votación ha sido eliminada exitosamente");
        fetchPositions();
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar la votación");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Votaciones</span>
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
              to="votaciones/crear"
            >
              Registrar votación
            </Link>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header">Listado de votaciones</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Tipo</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {votings.map((voting) => (
                    <tr key={voting.id}>
                      <td>{voting.name}</td>
                      <td>{voting.type}</td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`votaciones/${voting.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeVoting(voting)}
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

export default ShowVotings;
