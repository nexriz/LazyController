import React, { Component } from 'react'
import socket from 'socket.io-client';
import { Button, Popup, Checkbox, Input, Label, Segment, Icon, Header } from 'semantic-ui-react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

export default class Form extends Component {
  constructor() {
    super()

    this.state = {
      volume: 100,
      timeout: 1,
      ip: "192.168.0.16",
      port: "3001",
      connected: false
    }
  }
  componentWillMount() {
    this.socket = socket('http://' + this.state.ip  + ':' + this.state.port)
    this.socket.on('connection', server => {
      console.log(server)
      this.setState({ connected: true })
    })
    this.socket.on('disconnected', server => {
      this.setState({ connected: false })
    })
  }
  componentWillUnmount() {
    this.socket.close()
  }
  changeMute = (ev, data) => {
    this._emitToServer(data.checked ? 'mute' : 'unmute')
  }
  changeVolume = (volume, data) => {
    if(volume > 0 && volume < 100) {
      this.setState({volume: volume})
      this._emitToServer(`sv ${volume}`)
    }
  }

  shutdown = (ev, data) => {
    this._emitToServer(`shutdown /s /t ${this.state.timeout || "1"}`) 
  }
  abort = (ev, data) => {
    this._emitToServer(`shutdown /a`)
  }
  _emitToServer(msg) {
    this.socket.emit('console', msg)
  }
  changeTimeout = (ev, data) => {
    this.setState({timeout: ev.target.value})
  }
  vchanger = (volume) => {
    if (this.state.volume + volume >= 100)
      this.setState({ volume: 100 })
    else
      this.setState({volume: this.state.volume + volume})
    this._emitToServer(`sv ${this.state.volume}`)    
  }
  render() {
    const { volume, timeout, ip, port, connected } = this.state;
    const connectColor = connected === true ? "green" : "red" 
    console.log(connected)
    return (
      <div>
        <Segment>
          <Header as="h1"  style={{textAlign: "center"}}>
            <Icon name="power" color="standard" style={{opacity: 0.2, marginTop: 10 }} /></Header>
          <Segment color={connectColor}>
            <Connection connected={connected} ip={ip + ':' + port}/>
          </Segment>
          <Segment style={{padding: "10px 10px 50px 10px"}} clearing>
              <Header as="h2" style={{margin: 5,textAlign: "center", color: "rgba(0,0,0,0.3)"}}>Controller</Header> 
            <Segment style={{paddingBottom: 50}}>
              <div>
                <Label color='blue'>Volume</Label>
              </div>
              <Slider
                value={volume}
                tooltip={true}
                onChange={this.changeVolume}
              />
              <CB onChange={this.changeMute} timeout={timeout} changeTimeout={this.changeTimeout}/>

              <VolumeChanger vchanger={this.vchanger}/>
            </Segment>
          </Segment>


          <PopupClick shutdown={this.shutdown} abort={this.abort} inc={<Input size="mini" value={timeout} style={{width: "50px"}}onChange={this.changeTimeout} placeholder='timeout...' type="number"/>}/> <br/>
        </Segment>
      </div>
    )
  }
}

const VolumeChanger = ({ vchanger }) => (
<div style={{float: "right"}}>
    <Button icon="minus" size="small"onClick={() => vchanger(-10)}/>      
    <Button icon="plus" size="small" onClick={() => vchanger(10)}/>
</div>
)

const Connection = ({ connected, ip }) => (
  <div style={{ position: "relative", right: "0", left: "0",textAlign:"center",margin: "auto", fontSize: "700"}}>
    {
      connected 
        ? <ConnectIcon color="green" text="Connected" ip={ip}/> 
        : <ConnectIcon color="red" text="Not connected" ip={ip}/>
    }
  </div>
)

const ConnectIcon = ({color, text, ip}) => (
      <Popup
        trigger={
          <div style={{margin: "auto"}}>
            <Icon.Group>
              <Icon name="signal" style={{ color }}></Icon>
            </Icon.Group>
            <span>{text}</span>
          </div> 
        }
        content={ip}
      />
)

const PopupClick = ({shutdown, changeTimeout, timeout, inc, abort}) => (
  <div style = {{ margin: "20px 0px 10px 0px" }}>
    <Popup
      trigger={<Button color='red' icon='power' style={{ float: "right", margin: "50px 0"}} content='Stäng av' />}
      content={
        <div>
          <Button color='green' content='Godkänn' onClick={shutdown} />
          <Button onClick={abort}>Abort</Button>
          {inc}
        </div>}
      on='click'
      position='top right'
    />
  </div>
)


const CB = ({onChange}) => (
  <div style={{margin: "10px 0px 0px 0px", float: "left"}}>
    <Checkbox slider label={"Mute"} onChange={onChange}/>
  </div>
)

// const VolumeInput = ({changeVolume}) => (
//   <Input size="mini" onChange={changeVolume} placeholder='Volym...' type="number" />
// )