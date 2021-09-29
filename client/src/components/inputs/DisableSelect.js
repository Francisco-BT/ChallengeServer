import { FormSelect } from 'react-bootstrap';

export default function DisableSelect({ children, disabled, ...props }) {
  return (
    <FormSelect
      {...props}
      readOnly={disabled}
      disabled={disabled}
      onChange={disabled ? null : props.onChange}
    >
      {children}
    </FormSelect>
  );
}
