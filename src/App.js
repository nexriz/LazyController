import React, { Component } from 'react';
import './App.css';
import Form from './components/Form'

class App extends Component {
  render() {
    return (
      <div style={wrapper}>
        <div style={cstyle}>
          <Form>
          </Form>
        </div>
      </div>
    );
  }
}

const wrapper = {
  display: "flex",
  height: "100%",
  justifyContent: 'center',
  backgroundColor: "#333"
}
const cstyle = {
  width: 300,
  height: 400,
  marginTop: 50

}
export default App;
