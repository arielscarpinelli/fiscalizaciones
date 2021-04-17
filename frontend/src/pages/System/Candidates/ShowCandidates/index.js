/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getCandidates, deleteCandidate } from "api/modules/candidates.api";
import CandidateBasicPresentation from "components/Candidates/BasicPresentation";

const ShowCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setCandidates([]);
    try {
      const response = await getCandidates();
      setCandidates(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener los candidatos");
    } finally {
      setLoading(false);
    }
  };

  const removeCandidate = async (candidate) => {
    if (
      confirm(
        `¿Deseas eliminar al candidato ${candidate.first_name} ${candidate.last_name}?`
      )
    ) {
      try {
        await deleteCandidate(candidate.id);
        toast.info("El candidato ha sido eliminado exitosamente");
        history.push("/sistema/candidatos");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el candidato");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Candidatos</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchCandidates}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="candidatos/crear"
            >
              Registrar candidato
            </Link>
          </div>
        </div>
        <hr />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header">Listado de candidatos</div>
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Apellido y nombre</th>
                    <th scope="col">Tipo y Número de Documento</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <CandidateBasicPresentation candidate={candidate} />
                      </td>
                      <td>
                        {candidate.type_id} {candidate.number_id}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`candidatos/${candidate.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeCandidate(candidate)}
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

export default ShowCandidates;
