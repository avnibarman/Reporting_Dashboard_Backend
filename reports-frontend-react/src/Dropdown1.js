import React from 'react';
import eCallChart from './eCallChart';
import axios from 'axios';


var _this;
class Dropdown2 extends React.Component {

  constructor(props){
    super(props);

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.state = {
      value: 'month',
      operation: 'ecall',
      data: [],
      seconddata: []
    };


  }

  componentDidMount() {
    _this = this;
    this.getData(this.state.value, this.state.operation);

  }

  getData(newValue, operationValue) {

    axios.get('http://localhost:8080/incidents/'  + operationValue + '/' + newValue)
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
      <span className="title"><strong>Total Incidents</strong></span>
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
            <option value="ecall">eCall</option>
            <option value="icall">iCall</option>
            <option value="theftalarm">Theft Alarm</option>
            <option value="acn">ACN</option>
          </select>
        </label>
        </div>
      </form>

      <eCallChart timeFrame={this.state.value} data={this.state.data}/>

      </div>
    );
  }
}

export default Dropdown2;
