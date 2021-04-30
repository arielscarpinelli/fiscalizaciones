import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { resetPassword } from "api/modules/users.api";

import ActivateAccountForm from "components/Authentication/ActivateAccountForm";
import { toast } from "react-toastify";

const ActivateAccount = () => {
  const history = useHistory();

  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrors({});
    try {
      await resetPassword({ ...data, token });
      history.push("/sistema");
      toast.info("Tu contraseña ha sido modificada.");
    } catch (error) {
      setSubmitting(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="d-flex fullscreen align-items-center">
      <div className="row flex-grow-1 mb-4">
        <div className="col-lg-4 mx-auto">
          <ActivateAccountForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
