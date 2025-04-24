export interface Toast {
  id: number;
  label?: string;
  type: string;
  message: string;
}

export interface ToastContextType {
  onMessage: (message: string, type: string, label?: string) => void;
}
