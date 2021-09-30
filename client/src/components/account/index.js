export default function AccountPage({ match }) {
  const { id } = match.params;
  return <div>Account Page {id}</div>;
}
