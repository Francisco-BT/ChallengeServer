import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import LoaderIndicator from '../loader-indicator';
import AccountActions from './AccountActions';
import AccountTeam from './AcountTeam';
import { useAccount } from '../../hooks';

export default function AccountPage({ match, history }) {
  const { id } = match.params;
  const [fetchData, setFetchData] = useState(true);
  const refetchData = () => setFetchData((fetchData) => !fetchData);
  const { loading, account, errors } = useAccount(id, fetchData);

  if (errors === true) {
    return <Redirect to="/accounts" />;
  }

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
