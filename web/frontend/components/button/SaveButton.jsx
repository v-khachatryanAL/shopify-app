import { Button, Spinner } from "@shopify/polaris";
import "./buttons.css";

const SaveButton = ({ loading = false, disabled = false, onClick }) => {
  return (
    <div className="def-save-btn">
      <Button disabled={disabled} onClick={onClick}>
        {!loading ? "Save" : <Spinner size="small" />}
      </Button>
    </div>
  );
};

export default SaveButton;
