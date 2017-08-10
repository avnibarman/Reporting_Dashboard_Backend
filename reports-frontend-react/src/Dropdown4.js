import React from 'react';
import NumberOpPieChart from './NumberOpPieChart';
import axios from 'axios';

var _this;
class Dropdown3 extends React.Component {

  constructor(props){
    super(props);

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.state = {
      value: 'month',
      operation: 'doorLock',
      data: []
    };


  }

  componentDidMount() {
    _this = this;
    this.getData(this.state.value, this.state.operation);

  }

  getData(newValue, operationValue) {
    axios.get('http://localhost:8080/responseTime/'  + operationValue + '/' + newValue)
    .then(response => {
        const data = response.data;
        this.setState({data});    
      })
      .catch(function (error) {
          console.log(error);
      }); 
  }

  handleChange1(event) {
    const value = event.target.value;
    this.setState({value});
    this.getData(value, this.state.operation);
  }

  handleChange2(event){
    const operation = event.target.value;
    this.setState({operation});
    this.getData(this.state.value, operation);
  }

  render(){

    return (
      <div>
      <span className="title"><strong>Number of Operations</strong></span>
      <form>
        <div id="label3">
        <label>
          <select className="selectbutton" value={this.state.value} onChange={this.handleChange1}>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="6months">Past 6 Months</option>
            <option value="year">Year to Date</option>
          </select>
        </label>
        &nbsp;
        &nbsp;
        &nbsp;
        <label>
          <select className="selectbutton" value={this.state.operation} onChange={this.handleChange2}>
            <option value="doorLock">Door lock</option>
            <option value="doorUnlock">Door unlock</option>
            <option value="horn">Honk</option>
            <option value="lights">Flash</option>
            <option value="remoteAC">Climate control</option>
            <option value="engineOff">Engine off</option>
          </select>
        </label>
        </div>
      </form>
      <br />
      <div id="legend">
        <div id="bullet1">
        </div>
        <div id="average">
          Above average response time
        </div>

        <div id="bullet2">
        </div>
        <div id="expected">
          Above expected response time
        </div>
      </div>

      <div id="line1">
      <NumberOpPieChart data={this.state.data}/>
      </div>

      </div>
    );
  }
}

export default Dropdown3;
