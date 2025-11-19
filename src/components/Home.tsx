import Navbar from './Navbar';
import MetroMap from './MetroMap';
import SearchBar from './SearchBar';
import { StationsProvider } from './contexts/StationsContext/StationsContext';
import { ApiProvider } from './contexts/ApiContext/ApiContext';
import { NotificationProvider } from './contexts/NotificationContext/NotificationContext';

export default function Home() {

  return (
    <NotificationProvider>
      <ApiProvider>
        <StationsProvider>
          <Navbar/>
          <SearchBar />
          <MetroMap/>
        </StationsProvider>
      </ApiProvider>
    </NotificationProvider>
  );
}