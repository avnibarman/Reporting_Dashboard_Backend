import React from 'react';
import {XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area} from 'recharts'

class ROLineChart extends React.Component {

    
  render () {    

    if (!this.props.data) return null;


    return (
      <div id="temp">

      <AreaChart width={650} height={250} data={this.props.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="20%" stopColor="#61a9e8" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#61a9e8" stopOpacity={0}/>
          </linearGradient>
      
        </defs>
        <XAxis dataKey="date" domain={[0, 'dataMax + 1000']}/>
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip separator=" " className="tool"/>
        <Area type="monotone" dataKey="Times" stroke="#61a9e8" fillOpacity={1} fill="url(#color)" />
      </AreaChart>

      </div>

    );
  }
}

export default ROLineChart;
