import capitalize from 'lodash/capitalize';

import { useUserProfile, useAuth } from '../../hooks';
import LoaderIndicator from '../loader-indicator';

import './Home.css';

export default function HomePage() {
  const { user, logOut } = useAuth();
  const { userData, loading, error } = useUserProfile(user.id);

  if (error) {
    if (error.logOut) {
      logOut();
    }

    return <div>Fatal error: {JSON.stringify(error, null, 2)}</div>;
  }

  if (loading || !userData) {
    return <LoaderIndicator />;
  }

  return (
    <>
      <h3 className="Home-title">My Information</h3>
      <div className="Home-user-card-container">
        {Object.keys(userData).map((key, idx) => (
          <div key={idx} className="Home-user-card">
            <div className="Home-user-card-key">{capitalize(key)}: </div>
            <div>{userData[key] || '---'}</div>
          </div>
        ))}
      </div>
    </>
  );
}
