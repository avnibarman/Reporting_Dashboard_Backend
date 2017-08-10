import React from 'react';
import {Line, LineChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area} from 'recharts'

class NumberOpLineChart extends React.Component {

    
	render () {    

    if (!this.props.data) return null;

  	return (
      <div id="temp">

      <LineChart width={650} height={350} data={this.props.data.data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
       <XAxis dataKey="date"/>
       <YAxis type="number" domain={['dataMin - 0.4', 'dataMax + 0.4']}/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip separator=" " className="tool"/>/>
       <Legend verticalAlign="top" height={36}/>
       <Line type="monotone" dataKey="Max" stroke="#4e9de3" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="Average" stroke="#ba71e8" />
      </LineChart>



      
      </div>

    );
  }
}

export default NumberOpLineChart;
