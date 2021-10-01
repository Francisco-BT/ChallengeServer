import { useState } from 'react';

import AddTeamMembersModal from './AddTeamMembersModal';
import Table, { TableHead, TableBody, TableTitle } from '../table';

export default function AccountTeam({ team = [], accountId, refetchData }) {
  const [open, setOpen] = useState(false);
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
          <TableHead labels={['Id', 'Name', 'Email']} />
          <TableBody
            items={team}
            renderFunction={(member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
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
