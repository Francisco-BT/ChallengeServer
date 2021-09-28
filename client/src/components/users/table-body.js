import ActionsColumn from '../table/actions-column';

export default function TableBody({ users = [] }) {
  return (
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <ActionsColumn />
        </tr>
      ))}
    </tbody>
  );
}
