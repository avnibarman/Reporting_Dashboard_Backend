import React from 'react';
import Dropdown from './Dropdown'
import Dropdown1 from './Dropdown1'
import Dropdown2 from './Dropdown2'
import Dropdown3 from './Dropdown3'
import Dropdown4 from './Dropdown4'
import './App.css';

const App = () => {


  return (
    <div className="App">

    <div id="header">
      <strong>View Report Samples</strong>
      <br />
      <br />
      <button className="button">Login to view your reports</button>
      <br />
      <br />
    </div>

    <div id="first">
      <Dropdown/>
    </div>

      <br />
      <br />

    <div id="first_2">
      <Dropdown1 />
    </div>

      <br />
      <br />

    <div id="second">
      <Dropdown2 />     
    </div>

    <br />
      <br />

    <div id="third">
      <Dropdown3 />
    </div>

    <div id="fourth">
      <Dropdown4 />
    </div>

    </div>
    
  );
};

export default App;
