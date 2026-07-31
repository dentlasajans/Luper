import { toast } from 'sonner';

const getGlassStyle = () => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#f5f5f7',
  borderRadius: '16px',
});

export const notifySuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    style: getGlassStyle(),
  });
};

export const notifyError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    style: getGlassStyle(),
  });
};

export const notifyInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    style: getGlassStyle(),
  });
};
