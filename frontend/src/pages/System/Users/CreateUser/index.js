import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import UserForm from "components/Users/UserForm";
import { postUser } from "api/modules/users.api";
import UserContext from "context/UserContext";

const CreateUser = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [hasErrors, setErrors] = useState({});

  const returnToHome = () => {
    history.push("/sistema/usuarios");
  };

  const {
    userData: { role },
  } = useContext(UserContext);
  const isOperator = role === "OPERATOR";

  const rejectIfUserIsOperator = () => {
    if (isOperator) {
      toast.error("No tienes acceso a este módulo.");
      history.push("/sistema");
    }
  };

  useEffect(rejectIfUserIsOperator, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      await postUser(data);
      toast.info("El usuario ha sido creado exitosamente");
      history.push(`/sistema/usuarios`);
    } catch (error) {
      setSubmitting(false);
      if (error.isAxiosError && error.response.status === 422) {
        toast.warn("Alguno de los datos ingresados son inválidos");
        setErrors(error.response.data.errors);
      } else {
        toast.error(
          error.response.data.message ||
            "Ha ocurrido un error al crear el usuario"
        );
        console.error(error.response.data);
      }
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-lg-10 col-xl-8 mx-auto">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="m-0">Nuevo usuario</h2>
            Volver al <Link to="/sistema/usuarios">listado de usuarios</Link>
          </div>
          <div></div>
        </div>
        <hr />
        <UserForm
          onSubmit={onSubmit}
          discardChanges={returnToHome}
          isSubmitting={isSubmitting}
          errors={hasErrors}
        />
      </div>
    </div>
  );
};

export default CreateUser;
