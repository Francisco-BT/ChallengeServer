import { FormControl } from 'react-bootstrap';

export default function DisableInput({ disabled, ...props }) {
  return (
    <FormControl
      {...props}
      readOnly={disabled}
      disabled={disabled}
      onChange={disabled ? null : props.onChange}
    />
  );
}
