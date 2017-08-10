import React from 'react';
import {Legend, PieChart, Pie, Cell, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#340397', '#ba71e8', '#f8e71c', '#98cbed', '#59a7dc', '#2c82be'];

const RADIAN = Math.PI / 180; 

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'}  dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class ROPieChart extends React.Component{

    render () {

    return (

      <PieChart width={650} height={300} onMouseEnter={this.onPieEnter}>
        <Legend verticalAlign="top" iconType="circle" height={50}/>
        <Pie
          data={this.props.data.pieData} 
          cx={285} 
          cy={115} 
          innerRadius={70} 
          labelLine={false}
          outerRadius={130} 
          fill="#8884d8">
          {
            COLORS.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
        <Tooltip content={<CustomTooltip total={this.props.data.total}/>}/>
      </PieChart>
    );
  }

}


export default ROPieChart;