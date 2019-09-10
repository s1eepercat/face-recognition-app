import React, { Component } from 'react';
import './App.css';
import Logo from './components/Logo/Logo.js';
import Navigation from './components/Navigation/Navigation.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "white",
        blur: 5
      }
    },
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/* 
        
        <FaceRecognition /> */}
      </div>
    );
  }

}

export default App;
