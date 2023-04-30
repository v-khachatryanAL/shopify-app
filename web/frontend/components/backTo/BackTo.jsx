import Btn from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import "./BackTo.css";

const BackTo = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <div className="backTo">
      <div className="backTo__btn" onClick={handleNavigate}>
        <img src={Btn} alt="" />
        <span>Back</span>
      </div>
    </div>
  );
};

export default BackTo;
