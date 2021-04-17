import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { handleServersideValidationErrors } from "utils/forms";

import validation from "./validation";
import TextField from "components/Forms/TextField";
import TextAreaField from "components/Forms/TextAreaField";
import SelectField from "components/Forms/SelectField";

import uploadFile from "utils/uploadFile";

import {
  getCandidatePhoto,
  putCandidatePhoto,
} from "api/modules/candidates.api";
import { toast } from "react-toastify";

const CandidateForm = ({
  onSubmit,
  discardChanges,
  candidate,
  isReadonly,
  isSubmitting,
  errors,
  fromEdit,
}) => {
  const form = useForm({
    resolver: joiResolver(validation),
    defaultValues: candidate || {},
    mode: "all",
  });

  const [avatar, setAvatar] = useState(null);

  const getAvatar = () => {
    if (fromEdit) {
      setAvatar(getCandidatePhoto(candidate.id));
    }
  };

  useEffect(getAvatar, []);

  useEffect(() => {
    handleServersideValidationErrors(errors, form.setError);
  }, [errors, form.setError]);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const handleReset = () => {
    form.reset(candidate);
    if (fromEdit) {
      setAvatar(getCandidatePhoto(candidate.id));
    }
    discardChanges();
  };

  const inputRef = useRef();
  const changeAvatar = () => {
    inputRef.current.click();
  };

  const handleAvatar = async (event) => {
    const [file] = event.target.files;

    if (!file) {
      return false;
    }

    try {
      const formData = uploadFile("photo", file);
      await putCandidatePhoto(candidate.id, formData);
      setAvatar(null);
      setAvatar(getCandidatePhoto(candidate.id));
      toast.info("Se ha cambiado la foto de perfil del candidato");
      // const fileReader = new FileReader();
      // fileReader.onloadend = async () => {

      // };
      // fileReader.readAsDataURL(file);
    } catch (error) {
      toast.error(
        "Ha ocurrido un error al cambiar la foto de perfil del candidato"
      );
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        {fromEdit && (
          <div className="row mb-4">
            <div className="col-auto mx-auto avatar-container">
              <input
                type="file"
                hidden
                accept="image/*"
                name="avatar"
                ref={inputRef}
                onChange={handleAvatar}
              />
              <img
                src={avatar}
                className="d-block avatar"
                alt={`${candidate.first_name} ${candidate.last_name}`}
                title={`${candidate.first_name} ${candidate.last_name}`}
              />
              {!isReadonly && (
                <button
                  className="btn btn-sm btn-secondary btn-change-avatar"
                  onClick={changeAvatar}
                >
                  Modificar
                </button>
              )}
            </div>
          </div>
        )}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-6">
                <TextField
                  name="first_name"
                  label="Nombre del candidato"
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <TextField
                  name="last_name"
                  label="Apellido del candidato"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <SelectField
                  name="type_id"
                  label="Tipo de Documento"
                  options={[
                    { value: "DNI", text: "Documento Nacional de Identidad" },
                    { value: "PASAPORTE", text: "Pasaporte" },
                  ]}
                  readOnly={isReadonly}
                />
              </div>
              <div className="col-lg-6">
                <TextField
                  name="number_id"
                  label="Número de Documento"
                  readOnly={isReadonly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextAreaField
                  name="expertise"
                  label="Experiencia"
                  readOnly={isReadonly}
                  rows="8"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextAreaField
                  name="resume"
                  label="Resúmen"
                  readOnly={isReadonly}
                  rows="8"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <TextField
                  name="video_resume"
                  label="Video resúmen (enlace)"
                  readOnly={isReadonly}
                />
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

CandidateForm.propTypes = {
  onSubmit: PropTypes.func,
  discardChanges: PropTypes.func.isRequired,
  candidate: PropTypes.object,
  isReadonly: PropTypes.bool,
  fromEdit: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

CandidateForm.defaultProps = {
  onSubmit: () => {},
  candidate: {},
  isReadonly: false,
  fromEdit: false,
};

export default CandidateForm;
