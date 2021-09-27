import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

export default function LoaderIndicator({ height = 150, width = 150 }) {
  return (
    <div
      style={{
        height: 'calc(100vh - 80px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader type="Triangle" color="#ce0002" height={height} width={width} />
    </div>
  );
}
