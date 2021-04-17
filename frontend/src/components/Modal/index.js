import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Modal = ({ title, size, children, show, closeModal, ModalFooter }) => {
  useEffect(() => {
    if (show) {
      document.getElementById("documentBody").classList.add("fixed");
    } else {
      document.getElementById("documentBody").classList.remove("fixed");
    }

    return () => {
      document.getElementById("documentBody").classList.remove("fixed");
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <>
      <div
        className={`modal-backdrop fade ${show ? "show" : ""}`}
        onClick={closeModal}
      />
      <div
        className={`modal fade ${show ? "show" : ""} ${
          show ? "d-block" : "d-none"
        }`}
        tabIndex="-1"
        role="dialog"
      >
        <div className={`modal-dialog modal-${size}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{children}</div>
            {ModalFooter && (
              <div className="modal-footer">
                <ModalFooter />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  ModalFooter: PropTypes.func,
};

Modal.defaultProps = {
  size: "md",
  show: false,
  ModalFooter: null,
};

export default Modal;
