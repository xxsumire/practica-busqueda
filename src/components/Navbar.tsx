import '../styles/Navbar.css';
import logo_graph from '../assets/graph_icon.svg';

export default function Navbar () {
  return (
    <div className='navbar'>
      <img src={ logo_graph } alt='logo_graph' className='logo'/>
      <ul>
        <li>Home</li>
      </ul>
    </div>
  );
}