import React from "react";

interface Props {
  isChecked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const TatCheckbox = (props: Props) => {
  return (
    <div>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type="checkbox"
        checked={props.isChecked}
        onChange={props.handleChange}
      />
    </div>
  );
};
export default TatCheckbox;
