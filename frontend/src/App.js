import axios from 'axios';
import React, {Component} from 'react';


// import logo from './logo.svg';
// import './App.css';

export class App extends Component {
  state = { details: [] }

  componentDidMount(){
    let data;

    axios.get('http://localhost:8000')
    .then(res => {
      data = res.data;
      this.setState({
        details: data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Данные из DJANGO (127.0.0.1:8000)</header>
        <body>
          {this.state.details.map((output, id) => (
            <div key={id}>
              <h2>{output.title}</h2>
              <p>{output.description}</p>
            </div>
          ))}
        </body>
      </div>
    )
  }
}

export default App;
