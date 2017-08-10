import React from 'react';
import {XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area} from 'recharts'

class TotalsChart extends React.Component {

    
	render () {    

    if (!this.props.data) return null;

    var totalVehicles = this.props.data.Total_Provisioned_Vehicles;
    var totalTCUs = this.props.data.Total_TCU_Vehicles;

  	return (
      <div id="temp">

      <AreaChart width={1095} height={350} data={this.props.data.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="20%" stopColor="#2c82be" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#2c82be" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="20%" stopColor="#f8e71c" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#f8e71c" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" domain={[0, 'dataMax + 1000']}/>
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip separator=" " className="tool"/>
        <Area type="monotone" dataKey="Provisioned Vehicles" stroke="#2c82be" fillOpacity={1} fill="url(#colorPV)" />
        <Area type="monotone" dataKey="Provisioned TCUs" stroke="#f8e71c" fillOpacity={1} fill="url(#colorPT)" />
      </AreaChart>

      <div id="totals">
      <div id="totalPV">
      <span id="number1">{totalVehicles}</span>
      <br/>
      Provisioned Vehicles
      </div>
      <div id="totalTV">
      <span id="number2">{totalTCUs}</span>
      <br/>
      Provisioned TCUs
      </div>
      </div>  
      </div>

    );
  }
}

export default TotalsChart;
