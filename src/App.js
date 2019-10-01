import React, { Component } from 'react';
import './App.css';
import Logo from './components/Logo/Logo.js';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';

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
      value: 20,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}



const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
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

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({ initialState })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route });
  }

  render() {
    const { isSignedIn, box, imageUrl, route } = this.state;

    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />

        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />

        {
          route === 'home' ?
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div> : (
              route === 'signin' ?
                <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> :
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }

      </div>
    );
  }

}

export default App;
