import { FormControl } from 'react-bootstrap';

export default function DisableInput({ disabled, ...props }) {
  return (
    <FormControl
      {...props}
      disabled={disabled}
      value={props.value || ''}
      onChange={disabled ? null : props.onChange}
    />
  );
}
