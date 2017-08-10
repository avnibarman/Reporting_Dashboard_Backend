import React from 'react';

import PropTypes from 'prop-types';

class CustomTooltip extends React.Component {

  propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array
  };


  getName(number) {
    if (number === 0) {
      return "Door lock";
    } else if (number === 1) {
      return "Door unlock";
    } else if (number === 2) {
      return "Honk";
    } else if (number === 3) {
      return "Flash";
    } else if (number === 4) {
      return "Climate control";
    } else if (number === 5) {
      return "Engine off";
    }
  }

  getTotal(number){
    var result = number/this.props.total;
    result = result*100;
    return Math.round(result);
  }


  render () {    
      const { active } = this.props;

      if (active) {
        const { payload } = this.props;
        return (
          <div id="custom-tooltip">
            
          <strong>{this.getName(payload[0].name)}</strong>
          
            <li>Times: {payload[0].value}</li>
            <li>Percentage: {this.getTotal(payload[0].value)}%</li>
          
          </div>

        );
      }

      return null;
  }


}

export default CustomTooltip;