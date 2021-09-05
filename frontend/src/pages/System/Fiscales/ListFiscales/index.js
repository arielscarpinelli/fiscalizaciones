/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getFiscales, deleteFiscal } from "api/modules/fiscales.api";
import {  getSeccionElectoral } from "utils/geo"
import Pager from "components/Pager";
import {useQuery} from "utils/router";
import {SearchContext} from "utils/forms";
import SelectEscuelaField from "components/Escuelas/SelectEscuelaField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import TextField from "components/Forms/TextField";
import SelectPartidoField from "components/Partidos/SelectPartidoField";

const ListFiscales = () => {
  const [fiscales, setFiscales] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const {page, distrito, seccion, partido, q, escuela, mesa, dni} = useQuery();

  let doFetch = () => {
    fetchFiscales();
  };

  useEffect(doFetch, [page, distrito,
    seccion,
    partido,
    q,
    dni,
    escuela,
    mesa]);

  const fetchFiscales = async () => {
    setLoading(true);
    try {
      const response = await getFiscales({
        page,
        distrito,
        seccion,
        partido,
        dni,
        q,
        escuela,
        mesa
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

  const ESCUELA_OPTIONS = [
    { value: 'any', label: 'Tiene asignada'},
    { value: 'none', label: 'No tiene asignada'},
  ]

  return (
    <div className="row">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Fiscales</span>
          </div>
          <Pager data={fiscales}/>
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
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col">
                      <SearchContext>
                      <TextField
                          label="Apellido y nombre"
                          name="q"
                          placeholder="Filtrar"
                      />
                    </SearchContext>
                      </th>
                    <th scope="col" style={{width: 120}}>
                      <SearchContext>
                        <TextField
                            label="DNI"
                            name="dni"
                            placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <label>Municipio</label>
                      <div className="form-inline">
                        <SearchContext>
                          <SelectDistritoField name="distrito" empty={"Filtrar"} label=""/>
                          {distrito ? <SelectSeccionElectoralField name="seccion" distrito={distrito} empty={"Todos"} label=""/> : null}
                        </SearchContext>
                      </div>
                    </th>
                    <th scope="col" style={{width: 120}}>
                      <SearchContext>
                        <SelectPartidoField name="partido" empty={"Filtrar"} label="Partido"/>
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <SelectEscuelaField
                            extraOptions={ESCUELA_OPTIONS}
                            name="escuela"
                            className={"flex-grow-1 mr-3"}
                            placeholder={"Filtrar"}
                            isClearable={true}/>

                      </SearchContext>
                    </th>
                    <th scope="col">Mesa</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : fiscales.map((fiscal) => (
                    <tr key={fiscal.id}>
                      <td>
                        {fiscal.last_name.toUpperCase()}, {fiscal.first_name}
                      </td>
                      <td>
                        {fiscal.dni}
                      </td>
                      <td>
                        {(getSeccionElectoral(fiscal.distrito, fiscal.seccion_electoral) || {}).seccion}
                      </td>
                      <td>
                        {fiscal.partido_ ? fiscal.partido_.name : fiscal.partido}
                      </td>
                      <td>
                        {fiscal.escuela_ ? (fiscal.escuela_.codigo + " - " + fiscal.escuela_.nombre) : null}
                      </td>
                      <td>
                        {fiscal.mesa}
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
                <tfoot className="card-footer">
                  <tr><td colSpan={7}><Pager data={fiscales}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListFiscales;
