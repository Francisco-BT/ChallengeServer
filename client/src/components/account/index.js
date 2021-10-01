import { useState } from 'react';
import { Container } from 'react-bootstrap';

import LoaderIndicator from '../loader-indicator';
import AccountActions from './AccountActions';
import AccountTeam from './AcountTeam';
import { useAccount } from '../../hooks';

export default function AccountPage({ match, history }) {
  const { id } = match.params;
  const [fetchData, setFetchData] = useState(true);
  const refetchData = () => setFetchData((fetchData) => !fetchData);
  const { loading, account } = useAccount(id, fetchData);

  if (loading) {
    return <LoaderIndicator />;
  }

  return (
    <Container style={{ marginTop: '30px' }}>
      <AccountActions
        account={account}
        refetchData={refetchData}
        onDelete={() => history.goBack()}
      />
      <hr />
      <AccountTeam
        team={account.team}
        accountId={id}
        refetchData={refetchData}
      />
    </Container>
  );
}
