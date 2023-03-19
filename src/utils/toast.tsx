import { Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

export const ToastifyCloseButton = ({ closeToast }) => {
  return <CloseIcon color="primary" onClick={closeToast} />;
};

export const toastError = (title: string, subtitle?: string) => {
  toast.error(() => (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" className="nes-text">
        {title}
      </Typography>
      <Typography variant="subtitle2">{subtitle}</Typography>
    </Box>
  ));
};

export const toastInfo = (title: string, subtitle?: string) => {
  toast(() => (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4">{title}</Typography>
      <Typography variant="subtitle2">{subtitle}</Typography>
    </Box>
  ));
};

export const toastComingSoon = () => {
  toast(
    () => (
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" className="nes-text">
          Coming soon!
        </Typography>
      </Box>
    ),
    { icon: "🍻" }
  );
};
