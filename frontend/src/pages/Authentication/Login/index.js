import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "api/modules/users.api";

import UserContext from "context/UserContext";
import LoginForm from "components/Authentication/Login/LoginForm";

const Login = () => {
  const history = useHistory();
  const { setAuth, setIsLogged } = useContext(UserContext);

  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      const {
        data: { token, ...userData },
      } = await login(data);
      setAuth(token, userData);
      setIsLogged(true);
      history.push("/sistema");
    } catch (error) {
      setSubmitting(false);
      setErrors(error.response.data.errors);
    }
  };

  return (
    <div className="d-flex fullscreen align-items-center">
      <div className="row flex-grow-1 mb-4">
        <div className="col-lg-4 mx-auto">
          <LoginForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
