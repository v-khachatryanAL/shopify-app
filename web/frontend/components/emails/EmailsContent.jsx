import SettingsTemplate from "../settingsTemplate/SettingsTemplate";

const EmailsContent = ({ emails, changeEmails }) => {
  return (
    <div className="emails__content">
      {Object.entries(emails).map(([key, value], index) => {
        return (
          <SettingsTemplate
            key={index}
            title={key}
            data={value}
            changeValue={changeEmails}
          />
        );
      })}
    </div>
  );
};
export default EmailsContent;
