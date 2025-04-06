//
type ErrorResponseDataItemType = {
  status: number;
  message: string;
  timestamp: Date | null;
};

type ErrorResponseDataType = {
  data: ErrorResponseDataItemType;
};

export type ErrorResponseType = {
  response: ErrorResponseDataType;
  status: number;
};

//

type InputTextTargetValueType = {
  value: string;
};

export type InputTextChangeValueType = {
  target: InputTextTargetValueType;
};

export type SelectValueType = string | number | boolean | null | undefined;
export type SelectChangeValueType = string | number | boolean | Date | null;

export type SelectOptionsType = {
  label: string;
  value: string | number | boolean | Date | null;
  description?: string;
};

export type MultiSelectValueType = string[] | number[] | [] | null | undefined;
export type MultiSelectChangeValueType = string[] | number[] | boolean[] | Date[] | null;

export type WindowSizeType = {
  isShowButtons?: boolean;
  isMobile: boolean;
};
