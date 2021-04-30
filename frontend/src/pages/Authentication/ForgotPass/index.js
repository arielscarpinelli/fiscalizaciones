import React, {useState} from "react";
import {forgotPassword} from "api/modules/users.api";
import ForgotPasswordForm from "components/Authentication/ForgotPasswordForm";

const Login = () => {

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      await forgotPassword(data);
      setSubmitted(true);
    } catch (error) {
      setSubmitting(false);
      setErrors(error.response.data.errors);
    }
  };

  return (
    <div className="d-flex fullscreen align-items-center">
      <div className="row flex-grow-1 mb-4">
        <div className="col-lg-4 mx-auto">
          <ForgotPasswordForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
          {submitted && "Por favor chequee su email"}
        </div>
      </div>
    </div>
  );
};

export default Login;
