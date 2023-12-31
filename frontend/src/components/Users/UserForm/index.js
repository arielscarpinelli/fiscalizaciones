import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {useForm, FormProvider, useWatch} from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import SelectField from "components/Forms/SelectField";
import UserContext from "context/UserContext";
import SelectPartidoField from "components/Partidos/SelectPartidoField";
import SelectDistritoField from "components/Geo/SelectDistritoField";
import SelectSeccionElectoralField from "components/Geo/SelectSeccionElectoralField";

const UserForm = ({
  onSubmit,
  discardChanges,
  user,
  isReadonly,
  isSubmitting,
  errors,
}) => {
  const {
    userData: { role },
  } = useContext(UserContext);

  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: user || {},
    mode: "all",
  });

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(user);
    discardChanges();
  };

  const superAdminRoles = [
    {
      value: "OPERATOR",
      text: "Operador de partido (puede crear fiscales)",
    },
    { value: "ADMIN",
      text: "Admin de partido (puede crear operadores y fiscales)" },
    {
      value: "SUPERADMIN",
      text: "Super administrador",
    },
  ];

  const adminRoles = [
    {
      value: "OPERATOR",
      text: "Operador de partido",
    },
  ];

  const isSuperAdmin = role === "SUPERADMIN";

  const availableRoles = isSuperAdmin ? superAdminRoles : adminRoles;

  const distrito = useWatch({
    control: form.control,
    name: 'distrito',
  })

  return (
    <div className="card">
      <div className="card-body">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col">
                <TextField
                  name="name"
                  label="Nombre"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col">
                <TextField
                  name="email"
                  label="Correo electrónico"
                  readOnly={isReadonly}
                  type="email"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <SelectField
                  name="role"
                  label="Rol"
                  readOnly={isReadonly}
                  options={availableRoles}
                />
              </div>
              <div className="col-lg-6">
                <SelectPartidoField readOnly={isReadonly}/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <SelectDistritoField readOnly={isReadonly} empty={"-- No restringir --"}/>
              </div>
              <div className="col-6">
                {distrito && <SelectSeccionElectoralField distrito={distrito} readOnly={isReadonly} empty={"-- No restringir --"}/>}
              </div>
            </div>
            {!isReadonly && (
              <div className="d-flex justify-content-between flex-row-reverse">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={hasErrors || isSubmitting}
                >
                  Guardar cambios
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  user: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

UserForm.defaultProps = {
  onSubmit: () => {},
  user: {},
  isReadonly: false,
  fromEdit: false,
};

export default UserForm;
