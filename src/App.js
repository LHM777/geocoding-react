import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { countries } from './countries';
import { usStates } from './usStates';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const [showLocalNames, setShowLocalNames] = useState({});

  const handleSearch = async () => {

    if (!city) {
      setError('City is required.');
      return;
    }

    //console.log(state.value);
    setError('');
    const limit = 5;
    const url = `https://vercel-weather-api-server.vercel.app/api/geocode?city=${city}&state=${state?.value || ''}&country=${country?.value || ''}`;
    
  
    
    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        setResults(response.data);
      } else {
        setResults([]);
        setError('No results found.');
      }
      console.log(response.data);
    } catch (err) {
      setError('Error fetching data');
      setResults([]);
    }
    
  };


  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setIsStateDisabled(!(selectedCountry && selectedCountry.value === 'US'));
    setState(''); // Reset state input when country changes
  };


  const handleStateChange = (selectedState) => {

    //console.log(selectedState.value);
    setState(selectedState);
  }


  const toggleLocalNames = (index) => {
    setShowLocalNames((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


    // Custom styles for the Select component
    const customStyles = {
      container: (provided) => ({
        ...provided,
        width: '300px', // Adjust the width as needed
        margin: '0 auto', // Center the dropdown
      }),
      control: (provided) => ({
        ...provided,
        borderColor: 'gray', // Customize the border color
        boxShadow: 'none', // Remove the default box shadow
        '&:hover': {
          borderColor: 'darkgray', // Customize the border color on hover
        },
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 9999, // Ensure the menu is above other elements
      }),
    };

  return (
    <div className="App">
      <h1>Geocoding App</h1>
      <p className="info-text">Only the city field is required. You may provide the state and country for more precise results.
        The state field is only applicable for the U.S.</p>
      <div>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="required-field"
        />
        <Select
          options={usStates}
          value={state}
          onChange={handleStateChange}
          placeholder="Select a U.S. state"
          isClearable
          isDisabled={isStateDisabled}
          styles={customStyles}
        />
        <Select
          options={countries}
          value={country}
          onChange={handleCountryChange}
          placeholder="Select a country"
          isClearable
          styles={customStyles} // Apply custom styles
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <div className="results">
          <h2>Results:</h2>
          {results.map((result, index) => (
            <div key={index} className="result">
              <p><strong>Country:</strong> {result.country}</p>
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>State:</strong> {result.state || 'N/A'}</p>
              <p><strong>Latitude:</strong> {result.lat}</p>
              <p><strong>Longitude:</strong> {result.lon}</p>
              {result.local_names && (  // This ensures local_names is only accessed if it exists
                <div className="local-names">
                  <h3 onClick={() => toggleLocalNames(index)} style={{ cursor: 'pointer' }}>
                    Local Names {showLocalNames[index] ? '▲' : '▼'}
                  </h3>
                  {showLocalNames[index] && (
                    <ul className="columns">
                      {Object.entries(result.local_names).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

  );

};

export default App;