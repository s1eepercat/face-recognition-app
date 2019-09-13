import React, { Component } from 'react';
import './App.css';
import Logo from './components/Logo/Logo.js';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';

const app = new Clarifai.App({
  apiKey: '1311b8f1eae5417080d3b609d05fef9f'
});

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
      value: 35,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
    }
  }

  calculateFaceLocation = (response) => {
    const length = response.outputs[0].data.regions.length;
    const box = [];

    for (let i = 0; i < length; i++) {

      const clarifaiFace = response.outputs[0].data.regions[i].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      box.push({
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      });

    }

    return box;
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    this.setState({ route });
  }

  render() {
    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />

        <Navigation onRouteChange={this.onRouteChange} />

        {
          this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div> : (
              this.state.route === 'signin' ?
                < Signin onRouteChange={this.onRouteChange} /> :
                <Register onRouteChange={this.onRouteChange} />
            )
        }

      </div>
    );
  }

}

export default App;
