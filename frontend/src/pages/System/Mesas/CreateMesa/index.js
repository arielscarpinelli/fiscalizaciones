import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MesaForm from "components/Mesas/MesaForm";
import { postMesa } from "api/modules/mesas.api";
import { toast } from "react-toastify";

const CreateMesa = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/mesas");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postMesa(data);
      const mesaId = response.data.id;
      setSubmitting(false);
      toast.info("La mesa ha sido creado exitosamente");
      history.push(`/sistema/mesas/${mesaId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear la mesa");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo mesa</h2>
            Volver al <Link to="/sistema/mesas">listado de mesas</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <MesaForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateMesa;
