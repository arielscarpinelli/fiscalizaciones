import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import EscuelaForm from "components/Escuelas/EscuelaForm";
import { postEscuela } from "api/modules/escuelas.api";
import { toast } from "react-toastify";

const CreateEscuela = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/escuelas");
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const response = await postEscuela(data);
      const escuelaId = response.data.id;
      setSubmitting(false);
      toast.info("La escuela ha sido creado exitosamente");
      history.push(`/sistema/escuelas/${escuelaId}`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error("Ha ocurrido un error al crear la escuela");
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo escuela</h2>
            Volver al <Link to="/sistema/escuelas">listado de escuelas</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <EscuelaForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateEscuela;
