import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { login } from "api/modules/auth.api";

import UserContext from "context/UserContext";
import LoginDNIForm from "components/Login/LoginDNIForm";

import useAxios from "utils/useAxios";

const DNIStep = () => {
  const history = useHistory();
  const { setDNI } = useContext(UserContext);

  const onSuccess = ({ data }) => {
    setDNI(data.dni);
    history.push("/login/verificar-email");
  };

  const onError = (error) => {
    console.error("error", error);
  };

  const { onSubmit, isSubmitting, errors } = useAxios({
    submitFn: login,
    onSuccess,
    onError,
  });

  return (
    <div className="d-flex fullscreen align-items-center">
      <div className="row flex-grow-1 mb-4">
        <div className="col-lg-4 mx-auto">
          <LoginDNIForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default DNIStep;
