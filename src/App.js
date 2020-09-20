import React, { Component } from 'react';
import './App.css';
import Main from './components/Main.js';
import { Toolbar, Footer } from './components';

class App extends Component {
  render() {
    console.assert("from render")
    return (
      <div className="body" >
        <Toolbar />
        <Main />
        <Footer />
      </div>
    )
  }
}

export default App;
