import React, {useEffect, useState} from "react";
import useAxios from "utils/useAxios";
import {getActas} from "api/modules/actas.api";

import Spinner from "components/Spinner";

const ActaList = () => {
  const [list, setList] = useState([]);

  const { onSubmit: fetchActas, isSubmitting: isLoading } = useAxios({
    submitFn: getActas,
    onSuccess: ({ data }) => {
      setList(data);
    },
  });

  const callFetchVotings = () => {
    fetchActas();
  };

  useEffect(callFetchVotings, []);

  if (isLoading) {
    return <Spinner />
  }

  if (list.length === 0) {
    return (
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="h4 mb-0">No hay votaciones activas</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {list.map((acta) => (
        <div>{acta}</div>
      ))}
    </div>
  );
};

export default ActaList;
