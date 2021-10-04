import { useState } from 'react';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AddTeamMembersModal from './AddTeamMembersModal';
import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody, TableTitle } from '../table';
import { useDeleteModal, useRemoveMemberTeam } from '../../hooks';

export default function AccountTeam({ team = [], accountId, refetchData }) {
  const [open, setOpen] = useState(false);
  const { loading, removeTeamMember } = useRemoveMemberTeam(refetchData);
  const fire = useDeleteModal();

  if (loading) {
    return <LoaderIndicator />;
  }

  return (
    <>
      <TableTitle
        title="Team"
        onClick={() => setOpen(true)}
        plusButtonTooltip="Add Members"
      />
      <AddTeamMembersModal
        refetchData={refetchData}
        teamIds={team.map((t) => t.id)}
        accountId={accountId}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />

      {team.length ? (
        <Table hidePagination hideLimitSelector>
          <TableHead labels={['Id', 'Name', 'Email', 'Unassign']} />
          <TableBody
            items={team}
            renderFunction={(member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon
                    icon={faUserMinus}
                    color="#ce0002"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      fire(() => removeTeamMember(accountId, member.id))
                    }
                  />
                </td>
              </tr>
            )}
          />
        </Table>
      ) : (
        <div
          style={{
            textAlign: 'center',
            fontWeight: '700',
            color: '#303030',
            fontSize: '1.4rem',
            marginTop: '60px',
          }}
        >
          There are not team members yet, press the add button above to add team
          members.
        </div>
      )}
    </>
  );
}
