import React, {useEffect, useState} from "react";
import useAxios from "utils/useAxios";
import {getActas, getActaTemplate, postActa, putActa} from "api/modules/actas.api";

import Spinner from "components/Spinner";
import FormActa from "components/Actas/ActaForm";
import {toast} from "react-toastify";

const MyActasList = ({isLoading, list, onClick}) => {

  if (isLoading) {
    return <Spinner />
  }

  if (list.length === 0) {
    return (
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="h4 mb-0">No hay actas enviadas</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isLoading
    ? <tr>
      <td><Spinner/></td>
    </tr>
    : <div className="card-deck">
      {list.map(acta => <button className="card" key={acta.id} onClick={() => onClick(acta)} style={{width: '100%'}}>
          <div className="card-body">
            <h5 className="card-title">
              Mesa {acta.mesa}
            </h5>
            {acta.electores ? <h6 className="card-subtitle mb-2 text-muted">{acta.electores} electores</h6> : null}
          </div>
        </button>
      )}
    </div>

};

const ActaList = (props) => {

  const [list, setList] = useState([]);
  const [acta, setActa] = useState({});
  const [actaTemplate, setActaTemplate] = useState(null);

  const { onSubmit: fetchActas, isSubmitting: isLoading } = useAxios({
    submitFn: getActas,
    onSuccess: ({ data }) => {
      setList(data);
    },
  });

  const callFetchActas = () => {
    fetchActas();
  };

  useEffect(callFetchActas, []);

  const { onSubmit: fetchTemplate } = useAxios({
    submitFn: getActaTemplate,
    onSuccess: ({ data }) => {
      setActaTemplate(data);
      setActa(data);
    },
  });

  const callFetchListas = () => {
    fetchTemplate();
  };

  useEffect(callFetchListas, []);


  const { onSubmit, isSubmitting, errors } = useAxios({
    submitFn: (form) => acta.id ? putActa(acta.id, form) : postActa(form),
    onSuccess: () => {
      toast.success("Acta enviada correctamente");
      fetchActas();
      onClick(actaTemplate);
    }
  });

  const onClick = acta => {
    setActa({});
    setActa(acta);
    window.scrollTo(0, 0);
  }

  const onCancel = () => onClick(actaTemplate)

  return (<div>
    <h3 className="d-flex justify-content-between">
      {acta.id ? 'Editar' : 'Cargar'} acta
      {acta.id ? <button className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button> : null}
    </h3>
    {actaTemplate ? <FormActa onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              errors={errors}
              acta={acta}
              onCancel={onCancel}/> : <Spinner/>}
    <h3 style={{marginTop: '20px'}}>Mis actas</h3>
    <MyActasList list={list} isLoading={isLoading} onClick={onClick}/>
  </div>)

}


export default ActaList;
