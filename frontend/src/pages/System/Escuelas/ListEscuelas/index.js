/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

import Spinner from "components/Spinner";

import { toast } from "react-toastify";
import { getEscuelas, deleteEscuela } from "api/modules/escuelas.api";
import {getDistrito, getSeccionElectoral} from "utils/geo";
import Pager from "components/Pager";
import {useQuery} from "utils/router";
import {SearchContext} from "utils/forms";
import TextField from "components/Forms/TextField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";
import SelectPartidoField from "components/Partidos/SelectPartidoField";
import SelectField from "components/Forms/SelectField";

const ListEscuelas = () => {
  const {page, distrito, seccion, partido, q, codigo, direccion, fiscales} = useQuery();

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
        q,
        direccion,
        codigo,
        fiscales
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

  useEffect(doFetch, [page, distrito, seccion, partido, q, codigo, direccion, fiscales]);

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

  const fiscalesFilterOptions = [
    {
      text: "0",
      value: "=0"
    }, {
      text: "> 0",
      value: ">0"
    }, {
      text: "< 30% mesas",
      value: "<0.3*mesas_count"
    }, {
      text: "< 50% mesas",
      value: "<0.5*mesas_count"
    }, {
      text: "< 100% mesas",
      value: "<mesas_count"
    }
  ]

  return (
    <div className="row">
      <div className="col-12 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="h2 m-0">Escuelas</span>
          </div>
          <Pager data={escuelas}/>
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
            <div className="table-responsive card">
              <table className="table table-flush align-items-center">
                <thead className="card-header">
                  <tr>
                    <th scope="col" style={{width: 275}}>
                      <label>Municipio</label>
                      <div className="form-inline">
                        <SearchContext>
                          <SelectDistritoField name="distrito" empty={"Filtrar"} label=""/>
                          {distrito ? <SelectSeccionElectoralField name="seccion" distrito={distrito} empty={"Todos"} label="" style={{width: 160}}/> : null}
                        </SearchContext>
                      </div>
                    </th>
                    <th scope="col" style={{width: 100}}>
                      <SearchContext>
                        <TextField
                            label="Código"
                            name="codigo"
                            placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                            label="Nombre"
                            name="q"
                            placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">
                      <SearchContext>
                        <TextField
                            label="Dirección"
                            name="direccion"
                            placeholder="Filtrar"
                        />
                      </SearchContext>
                    </th>
                    <th scope="col" style={{width: 110}}>
                      <SearchContext>
                        <SelectPartidoField name="partido" empty={"Filtrar"} label="Partido"/>
                      </SearchContext>
                    </th>
                    <th scope="col" style={{width: 110}}>
                      <SearchContext>
                        <SelectField
                            name="fiscales"
                            label="Fiscales"
                            empty="Filtrar"
                            options={fiscalesFilterOptions}
                        />
                      </SearchContext>
                    </th>
                    <th scope="col">Mesas</th>
                    <th scope="col" style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td><Spinner/></td></tr> : escuelas.map((escuela) => (
                    <tr key={escuela.id}>
                      <td>
                        {getDistrito(escuela.distrito) + " - " + getSeccionElectoral(escuela.distrito, escuela.seccion_electoral).seccion}
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
                <tfoot className="card-footer">
                  <tr><td colSpan={8}><Pager data={escuelas}/></td></tr>
                </tfoot>
              </table>
            </div>
      </div>
    </div>
  );
};

export default ListEscuelas;
