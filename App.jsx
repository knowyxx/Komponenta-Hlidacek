import React, { useState, useEffect, useRef } from 'react';

const API_URL = 'https://crm.skch.cz/ajax0/procedure.php?cmd=getSummaryOfDrinks&userId=3';

function App() {
  const [drinks, setDrinks] = useState([]);
  const [apiStatus, setApiStatus] = useState('unknown'); 
  const [notification, setNotification] = useState('');
  
  const prevDrinksCount = useRef(null);

  // Funkce pro stahování dat
  const fetchCoffeeData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Chyba');
      
      const data = await response.json();
      
      if (apiStatus === 'offline' || apiStatus === 'unknown') {
        setApiStatus('online');
        setNotification('API bezi');
      }

      const currentDrinks = Array.isArray(data) ? data : (data.drinks || []);
      setDrinks(currentDrinks);

      // Pokud přibyla káva, přepíšeme text notifikace
      if (prevDrinksCount.current !== null && currentDrinks.length > prevDrinksCount.current) {
        setNotification(`NOTIFIKACE: Nová káva! Celkem: ${currentDrinks.length}`);
      }
      
      prevDrinksCount.current = currentDrinks.length;
    } catch (error) {
      if (apiStatus !== 'offline') {
        setApiStatus('offline');
        setNotification('CHYBA: API nedostupné!');
      }
    }
  };

  useEffect(() => {
    fetchCoffeeData();
    const interval = setInterval(fetchCoffeeData, 5000); // kontrola každých 5 sekund
    return () => clearInterval(interval);
  }, [apiStatus]);

  return (
    <div>
      {/* Brutálně jednoduchá notifikace navrchu stránky – ukáže se jen když je v ní text */}
      {notification && (
        <div style={{ background: '#ffff00'}}>
          <strong>{notification}</strong>
          <button onClick={() => setNotification('')}>X</button>
        </div>
      )}

      <h1>Kafe Status App</h1>
      
      <p>
        Stav serveru: 
        <p>
          {apiStatus === 'online' ? ' ONLINE' : ' OFFLINE'}
        </p>
      </p>


      <h2>Stažená data:</h2>
      {drinks.length === 0 ? (
        <p>Žádná data...</p>
      ) : (
        <ul>
          {drinks.map((drink, i) => (
            <li key={i}>
              {JSON.stringify(drink)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;