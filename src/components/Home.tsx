import Navbar from './Navbar';
import MetroMap from './MetroMap';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { StationsProvider } from './contexts/StationsContext/StationsContext';

export default function Home() {

  return (
    <StationsProvider>
      <Navbar/>
      <SearchBar />
      <MetroMap/>
    </StationsProvider>
  );
}