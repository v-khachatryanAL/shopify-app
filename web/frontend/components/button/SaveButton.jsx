import { Button, Spinner } from "@shopify/polaris";
import "./buttons.css";

const SaveButton = ({
  loading = false,
  disabled = false,
  onClick,
  label = "Save",
}) => {
  return (
    <div className="def-save-btn">
      <Button disabled={disabled} onClick={onClick}>
        {!loading ? label : <Spinner size="small" />}
      </Button>
    </div>
  );
};

export default SaveButton;
