import React, {useContext, useEffect} from "react";
import {useHistory} from "react-router-dom";

import UserContext from "context/UserContext";

import useAxios from "utils/useAxios";
import ValidateEmailForm from "components/Login/ValidateEmailForm";
import {validateEmail} from "api/modules/auth.api";

const ValidateEmailStep = () => {
  const {
    dni,
    setDNI,
    setAuthToken,
    setEmailValidated,
    setIsLogged,
    setPhone,
  } = useContext(UserContext);
  const history = useHistory();

  const checkDNI = () => {
    if (!dni || dni === "") {
      history.push("/login/iniciar-sesion");
    }
  };

  useEffect(checkDNI, []);

  const onSuccess = ({ data }) => {
    setEmailValidated(true);
    setAuthToken(data.token)

    if (data.nextStep === "MUST_VALIDATE_PHONE") {
      setPhone(data.phone);
      history.push("/login/verificar-telefono");
      return false;
    }

    setIsLogged(true);
    history.push("/sistema");
  };

  const onError = (error) => {
    console.error("error", error);
  };

  const discardChanges = () => {
    setDNI(null);
    history.push("/login/iniciar-sesion");
  };

  const { onSubmit, isSubmitting, errors } = useAxios({
    submitFn: (data) => validateEmail({ dni, ...data}),
    onSuccess,
    onError,
  });

  return (
    <div className="d-flex fullscreen align-items-center">
      <div className="row flex-grow-1 mb-4">
        <div className="col-lg-4 mx-auto">
          <ValidateEmailForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            discardChanges={discardChanges}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default ValidateEmailStep;
