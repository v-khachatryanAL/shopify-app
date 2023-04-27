import { Spinner } from "@shopify/polaris";
import "./loading.css";

export default function Loading({ size = "small" }) {
  return (
    <div className="loading defaultLoading">
      <Spinner accessibilityLabel="Small spinner example" size={size} />
    </div>
  );
}
