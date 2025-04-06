import React, { ReactElement } from 'react';

import { Modal as ModalAntd } from 'antd';

import './modal.css';

type Props = {
  title?: string;
  isOpen: boolean;
  onOk?: () => void;
  onCancel: () => void;
  width: number;
  isFooter?: boolean;
  isCentered?: boolean;
  children: ReactElement | string;
};

export const Modal = (props: Props) => {
  const {
    title,
    isOpen,
    onOk = () => {},
    onCancel = () => {},
    width = 700,
    isFooter = false,
    isCentered = false,
    children,
  } = props;

  if (!isOpen) return null;

  return (
    <ModalAntd
      title={title}
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      footer={isFooter}
      centered={isCentered}
      maskClosable={true}>
      {children}
    </ModalAntd>
  );
};
