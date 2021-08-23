/* eslint-disable no-restricted-globals */
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import Spinner from "components/Spinner";

import {toast} from "react-toastify";
import {getSeccionElectoral} from "utils/geo"
import Pager from "components/Pager";
import {useQuery} from "utils/router";
import {SearchContext} from "utils/forms";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import TextField from "components/Forms/TextField";
import {deleteActa, getActas} from "api/modules/actas.api";
import SelectActaEstadoField from "components/Actas/SelectActaEstadoField";

const ListActas = () => {
  const [actas, setActas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const {page, eleccion, distrito, seccion, mesa, fiscal, estado} = useQuery();

  let doFetch = () => {
    fetchActas();
  };

  useEffect(doFetch, [page, eleccion, distrito, seccion, mesa, fiscal, estado]);

  const fetchActas = async () => {
    setLoading(true);
    try {
      const response = await getActas({
        page,
        eleccion, distrito, seccion, mesa, fiscal, estado
      });
      setActas(response.data);
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener las actas");
    } finally {
      setLoading(false);
    }
  };

  const removeActa = async (acta) => {
    if (
      confirm(
        `¿Deseas eliminar el acta de la mesa ${acta.mesa}?`
      )
    ) {
      try {
        await deleteActa(acta.id);
        toast.info("El acta ha sido eliminada exitosamente");
        history.push("/sistema/actas");
      } catch (error) {
        toast.error("Ha ocurrido un error al eliminar el acta");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Actas de mesa</span>
          </div>
          <Pager data={actas}/>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={fetchActas}
            >
              Actualizar listado
            </button>
            <Link
              className="btn btn-sm btn-outline-primary"
              to="actas/crear"
            >
              Registrar acta
            </Link>
          </div>
        </div>
        <hr />
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col">
                      Elección
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
                    <th scope="col">
                      <SearchContext>
                        <TextField
                          label="Mesa"
                          name="mesa"
                          placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                          label="Fiscal"
                          name="fiscal"
                          placeholder="Filtrar (apellido o DNI)"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <SelectActaEstadoField empty="Filtrar"/>
                      </SearchContext>
                    </th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : actas.map((acta) => (
                    <tr key={acta.id}>
                      <td>
                        {acta.eleccion_ ? acta.eleccion_.nombre : acta.eleccion}
                      </td>
                      <td>
                        {(getSeccionElectoral(acta.distrito, acta.seccion_electoral) || {}).seccion}
                      </td>
                      <td>
                        {acta.mesa}
                      </td>
                      <td>
                        {acta.fiscal_ ? acta.fiscal_.last_name.toUpperCase() + ", " + acta.fiscal_.first_name + ". DNI " + acta.fiscal_.dni : acta.fiscal}
                      </td>
                      <td>
                        {acta.estado}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            className="btn btn-outline-secondary btn-sm"
                            to={`actas/${acta.id}`}
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeActa(acta)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="card-footer">
                  <tr><td colSpan={7}><Pager data={actas}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListActas;
