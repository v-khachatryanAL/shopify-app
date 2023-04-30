import DefaultToggle from "../defaultToggle/DefaultToggle";
import CompanyBottom from "./CompanyBottom";
import CompanyInfo from "./CompanyInfo";
import CompanySocial from "./CompanySocial";

const CompanyBody = ({ company, changeCompany }) => {
  return (
    <div className="company__body">
      <div className="def-container">
        <div className="company__auto">
          <span>Auto update these fields from your store.</span>
          <DefaultToggle
            value={company.visiable}
            onChange={(value) => {
              changeCompany("visiable", value);
            }}
          />
        </div>
        <div className="company__content">
          <CompanyInfo company={company} changeCompany={changeCompany} />
          <CompanySocial company={company} changeCompany={changeCompany} />
        </div>
        <CompanyBottom company={company} changeCompany={changeCompany} />
      </div>
    </div>
  );
};
export default CompanyBody;
