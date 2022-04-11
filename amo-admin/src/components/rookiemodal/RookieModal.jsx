import React from "react";
import { Card, CardBody, CardTitle, Modal } from "reactstrap";
import Xsquarebtn from "../Button/Xsquarebtn";

const RookieModal = ({
  title,
  modalIsOpen,
  closeModal,
  customStyles,
  children,
  isModalHeader
}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onClosed={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      centered
    >
      <Card className="rookiemodal">
        <CardBody className="rookiemodal-body">
          {
            isModalHeader ?
            <CardTitle className="rookiemodal-body__title">
            {
              title ?  <div className="rookiemodal-body__title__content">{title}</div> : null
            }
            <div className="rookiemodal-body__title__content">
              <Xsquarebtn onClick={() => closeModal()}>Close</Xsquarebtn>
            </div>
          </CardTitle> : null
          }
          <div className="rookiemodal-body-content">{children}</div>
        </CardBody>
      </Card>
    </Modal>
  );
};

export default RookieModal;
