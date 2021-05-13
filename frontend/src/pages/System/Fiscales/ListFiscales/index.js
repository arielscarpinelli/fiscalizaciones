/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getFiscales, deleteFiscal } from "api/modules/fiscales.api";
import {  getSeccionElectoral } from "utils/geo"
import Pager from "components/Pager";
import {useQuery} from "utils/router";

const ListFiscales = () => {
  const [fiscales, setFiscales] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const {page} = useQuery();

  let doFetch = () => {
    fetchFiscales();
  };

  useEffect(doFetch, [page]);

  const fetchFiscales = async () => {
    setLoading(true);
    try {
      const response = await getFiscales({
        page
      });
      setFiscales(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener los fiscales");
    } finally {
      setLoading(false);
    }
  };

  const removeFiscal = async (fiscal) => {
    if (
      confirm(
        `¿Deseas eliminar al fiscal ${fiscal.first_name} ${fiscal.last_name}?`
      )
    ) {
      try {
        await deleteFiscal(fiscal.id);
        toast.info("El fiscal ha sido eliminado exitosamente");
        history.push("/sistema/fiscales");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el fiscal");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Fiscales</span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchFiscales}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="fiscales/crear"
            >
              Registrar fiscal
            </Link>
          </div>
        </div>
        <hr />
          <div className="card">
            <div className="card-header d-flex align-items-center ">
              Listado de fiscales
              <Pager data={fiscales}/>
            </div>
            {isLoading ? (
                <Spinner />
            ) : (
            <div className="table-responsive">
              <table className="table table-flush align-items-center">
                <thead>
                  <tr>
                    <th scope="col">Apellido y nombre</th>
                    <th scope="col">DNI</th>
                    <th scope="col">Municipio</th>
                    <th scope="col">Partido</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {fiscales.map((fiscal) => (
                    <tr key={fiscal.id}>
                      <td>
                        {fiscal.last_name.toUpperCase()}, {fiscal.first_name}
                      </td>
                      <td>
                        {fiscal.dni}
                      </td>
                      <td>
                        {getSeccionElectoral(fiscal.distrito, fiscal.seccion_electoral).seccion}
                      </td>
                      <td>
                        {fiscal.partido_ ? fiscal.partido_.name : fiscal.partido}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`fiscales/${fiscal.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFiscal(fiscal)}
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
              <Pager data={fiscales}/>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ListFiscales;
