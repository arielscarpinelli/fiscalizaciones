import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import FiscalForm from "components/Fiscales/FiscalForm";
import { postFiscal } from "api/modules/fiscales.api";
import { toast } from "react-toastify";

const CreateFiscal = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/fiscales");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postFiscal(data);
      const fiscalId = response.data.id;
      toast.info("El fiscal ha sido creado exitosamente");
      history.push(`/sistema/fiscales/${fiscalId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear el fiscal");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo fiscal</h2>
            Volver al <Link to="/sistema/fiscales">listado de fiscales</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <FiscalForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateFiscal;
