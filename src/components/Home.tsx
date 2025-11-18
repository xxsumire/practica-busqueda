import Navbar from './Navbar';
import MetroMap from './MetroMap';
import SearchBar from './SearchBar';
import { StationsProvider } from './contexts/StationsContext/StationsContext';
import { ApiProvider } from './contexts/ApiContext/ApiContext';

export default function Home() {

  return (
    <ApiProvider>
      <StationsProvider>
        <Navbar/>
        <SearchBar />
        <MetroMap/>
      </StationsProvider>
    </ApiProvider>
  );
}