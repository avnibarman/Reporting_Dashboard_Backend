import React from 'react';
import ROLineChart from './ROLineChart';
import axios from 'axios';
import ROPieChart from './ROPieChart';


var _this;
class Dropdown2 extends React.Component {

  constructor(props){
    super(props);

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.state = {
      value: 'month',
      operation: 'doorLock',
      data: [],
      seconddata: []
    };


  }

  componentDidMount() {
    _this = this;
    this.getData(this.state.value, this.state.operation);

  }

  getData(newValue, operationValue) {
    axios.all([
        axios.get('http://localhost:8080/pie/' + newValue),
        axios.get('http://localhost:8080/' + operationValue + '/' + newValue)
      ])
    .then(axios.spread(function (firstResponse, secondResponse) {
      const data = firstResponse.data;
      _this.setState({data: data});
      
      const data2 = secondResponse.data;
       _this.setState({seconddata: data2});


    }));
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
      <span className="title"><strong>Remote Operations</strong></span>
      <form>
        <div id="label2">
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
      <div id="pie">
      <ROPieChart timeFrame={this.state.value} data={this.state.data}/>
      </div>
      <div id="line">
      <br/>
      <br/>
      Times
      <ROLineChart timeFrame={this.state.value} data={this.state.seconddata.data}/>
      </div>

      </div>
    );
  }
}

export default Dropdown2;
