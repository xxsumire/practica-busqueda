import '../styles/Navbar.css';
import TrainIcon from '@mui/icons-material/Train';

export default function Navbar () {
  return (
    <div className='navbar'>
      <TrainIcon style={{color: '#fff', fontSize: 40}}/>
      <ul>
        <li>
          <a className='active' href='index.html'>Home</a>
        </li>
      </ul>
    </div>
  );
}