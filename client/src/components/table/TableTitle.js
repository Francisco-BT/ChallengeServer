import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { IconButton } from '../inputs';

export default function TableTitle({
  children,
  title,
  showPlusButton = true,
  plusButtonTooltip = '',
  onClick,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h3
        style={{
          marginBottom: '30px',
          fontSize: '2rem',
          fontWeight: '800',
          color: '#ce0002',
          display: 'inline',
        }}
      >
        {title}
      </h3>
      <span style={{ display: 'flex' }}>
        {showPlusButton ? (
          <IconButton
            icon={faPlus}
            onClick={onClick}
            tooltip={plusButtonTooltip}
          />
        ) : null}
        {children}
      </span>
    </div>
  );
}
