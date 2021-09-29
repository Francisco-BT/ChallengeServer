export function TableHead({ labels = [] }) {
  return (
    <thead>
      <tr>
        {labels.map((label, idx) => (
          <th key={label + idx}>{label}</th>
        ))}
      </tr>
    </thead>
  );
}
