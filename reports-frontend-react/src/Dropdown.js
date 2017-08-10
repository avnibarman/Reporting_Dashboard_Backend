import React from 'react';
import TotalsChart from './TotalsChart';
import axios from 'axios';

var totalVehicles;
var totalTCUs;

class Dropdown extends React.Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: 'week',
      data: []
    };
  }

  componentDidMount() {
    this.getVehicleTotal('month');
    this.getVehicleTotal(this.state.value);
  }
   
  getVehicleTotal(newValue) {

    axios.get('http://localhost:8080/totals/' + newValue)
    .then(response => {
        const data = response.data;
        totalVehicles = response.data.Total_Provisioned_Vehicles;
        totalTCUs = response.data.Total_TCU_Vehicles;
        this.setState({value: newValue});
        this.setState({data});    
      })
      .catch(function (error) {
          console.log(error);
      }); 
  }

  handleChange(event) {
    const newValue = event.target.value;
    this.getVehicleTotal(newValue);
  }

  render(){  
    return (
      <div>
      <span className="title"><strong>Total Amount</strong></span>
      <form>
        <div id="label">
        <label>
          <select className="selectbutton" value={this.state.value} onChange={this.handleChange}>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="6months">Past 6 Months</option>
            <option value="year">Year to Date</option>
          </select>
        </label>
        </div>
      </form>
      <TotalsChart timeFrame={this.state.value} data={this.state.data}/>

      </div>
    );
  }
}

export default Dropdown;
