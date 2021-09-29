import { FormSelect } from 'react-bootstrap';

export default function DisableSelect({ children, disabled, ...props }) {
  return (
    <FormSelect
      {...props}
      readOnly={disabled}
      disabled={disabled}
      value={props.value || ''}
      onChange={disabled ? null : props.onChange}
    >
      {children}
    </FormSelect>
  );
}
