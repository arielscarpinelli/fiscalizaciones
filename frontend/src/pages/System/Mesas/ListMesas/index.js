/* eslint-disable no-restricted-globals */
import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import Spinner from "components/Spinner";

import {toast} from "react-toastify";
import {listMesas, deleteMesa} from "api/modules/mesas.api";
import Pager from "components/Pager";
import {useQuery} from "utils/router";
import SelectEscuelaField from "components/Escuelas/SelectEscuelaField";
import {SearchContext} from "utils/forms";
import TextField from "components/Forms/TextField";

const ListMesas = () => {
  const [mesas, setMesas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

  const {page, escuela, codigo} = useQuery();

  const doFetch = () => {
    fetchMesas();
  };

  useEffect(doFetch, [page, escuela, codigo]);

  const fetchMesas = async () => {
    setLoading(true);
    try {
      const response = await listMesas({
        page,
        escuela,
        codigo
      });
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
          <Pager data={mesas}/>
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
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col">
                      <SearchContext>
                        <SelectEscuelaField
                            name="escuela"
                            className="flex-grow-1 mr-3"
                            placeholder="Filtrar"
                            isClearable={true}/>
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                            label="Numero"
                            name="codigo"
                            placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col" style={{width: 100}}/>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : mesas.map((mesa) => (
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
                <tfoot className="card-footer">
                  <tr><td colSpan={3}><Pager data={mesas}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListMesas;
