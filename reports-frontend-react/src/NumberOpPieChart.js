import React from 'react';
import {Pie, PieChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Cell} from 'recharts'
import CustomTooltip2 from './CustomTooltip2';

const COLORS_1 = ['#2c82be', '#dbecf8'];

const COLORS_2 = ['#76ddfb','#dbecf8'];

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

class NumberOpPieChart extends React.Component {

    
	render () {    

    if (!this.props.data) return null;
    console.log("above is " + this.props.data);

  	return (
      <div id="temp">

      <PieChart width={500} height={400}>

      <Tooltip content={<CustomTooltip2 />}/>
        <Pie data={this.props.data.aboveAverage} 
        cx={300} cy={170} 
        outerRadius={130} 
        innerRadius={110} 
        fill="#2c82be" >{
            COLORS_1.map((entry, index) => <Cell fill={COLORS_1[index % COLORS_1.length]}/>)
          }
        </Pie>

        <Pie data={this.props.data.aboveExpected} 
        cx={300} cy={170} 
        outerRadius={160} 
        innerRadius={140}  
        fill="#76ddfb" >
        {
            COLORS_2.map((entry, index) => <Cell fill={COLORS_2[index % COLORS_2.length]}/>)
          }
        </Pie>
        
       </PieChart>
      
      </div>

    );
  }
}

export default NumberOpPieChart;
