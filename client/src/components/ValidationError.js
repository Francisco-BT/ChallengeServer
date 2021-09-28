export default function ValidationError({ error }) {
  return error ? (
    <div style={{ fontSize: 14, color: 'red', fontStyle: 'italic' }}>
      {error}
    </div>
  ) : null;
}
