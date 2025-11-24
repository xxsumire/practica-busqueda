import '../styles/Navbar.css';
import TrainIcon from '@mui/icons-material/Train';

export default function Navbar () {
  return (
    <div className='navbar'>
      <a className='logo-navbar' href='index.html'>
        <TrainIcon
          style={{
            color: 'black',
            fontSize: '2.3rem',
            transition: 'all 0.2s'
          }}
        />
        <span className='logo-text'>Metro CDMX.</span>
      </a>
    </div>
  );
}