import React from 'react';
import { chartOptions } from '../../constants/chartOptions';
const LineChart = require("react-chartjs-2").Line;

const labelMap= {
  price_usd: 'Price',
  volume_usd_24h: 'Volume',
  market_cap_usd: 'Market Cap'
};

export default class Chart extends React.Component {
  
  setType(type){
    let currencyData = this.props.currencyData;
    currencyData[this.props.selectedCurrency].type = type;
    this.props.updateCurrencyData(currencyData);
    this.forceUpdate();
  }
  
  setRange(range){
    let currencyData = this.props.currencyData;
    currencyData[this.props.selectedCurrency].range = range;
    this.props.updateCurrencyData(currencyData);
    this.forceUpdate();
  }
  
  chartElemClick(chartData, chartElement){
    let { currencyData, selectedCurrency } = this.props;
    if ( currencyData[selectedCurrency].type === 'price_usd') {
      let chartElemIndex = chartElement[0] ? chartElement[0]._index : 0;
      currencyData[selectedCurrency].selected_price = chartData[chartElemIndex];
      this.props.updateCurrencyData(currencyData);
    }
  }
  
  getData(chartData, currencyData){
    let labels = chartData.map(i => "");
    return {
      labels: labels,
    	datasets: [
    		{
    			label: labelMap[currencyData.type],
    			fillColor: "rgba(151,187,205,0.2)",
    			strokeColor: "rgba(151,187,205,1)",
    			//pointColor: "rgba(151,187,205,1)",
    			//pointStrokeColor: "#fff",
    			//pointHighlightFill: "#fff",
    			//pointHighlightStroke: "rgba(151,187,205,1)",
    			data: chartData,
    			showLines: false,
    			spanGaps: false
    		}
    	]
    };
  }

  render() {
    let chartData = this.props.chartData;
    let currencyInfo = this.props.currencyData[this.props.selectedCurrency];
    let chartKey = `${currencyInfo.name}-chart`;
    return [
      <tr>
        <td colSpan='3' className="text-left">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={currencyInfo.type === 'price_usd' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.type === 'price_usd'} onClick={this.setType.bind(this, 'price_usd')} autoComplete="off" /> Price
            </label>
            <label className={currencyInfo.type === 'market_cap_usd' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.type === 'market_cap_usd'} onClick={this.setType.bind(this, 'market_cap_usd')} autoComplete="off" /> Market Cap
            </label>
            <label className={currencyInfo.type === 'volume_usd_24h' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.type === 'volume_usd_24h'} onClick={this.setType.bind(this, 'volume_usd_24h')} autoComplete="off" /> Volume
            </label>
          </div>
        </td>
        <td colSpan='3' className="text-right">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={currencyInfo.range === 1 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.range === 1} onClick={this.setRange.bind(this, 1)} autoComplete="off" /> 24H
            </label>
            <label className={currencyInfo.range === 7 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.range === 7} onClick={this.setRange.bind(this, 7)} autoComplete="off" /> 7 Days
            </label>
            <label className={currencyInfo.range === 30 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={currencyInfo.range === 30} onClick={this.setRange.bind(this, 30)} autoComplete="off" /> 30 Days
            </label>
          </div>
        </td>
      </tr>,
      <tr>
        <td colSpan="6">
          <LineChart key={chartKey} ref={chartKey} data={this.getData(chartData, currencyInfo)} width={800} options={chartOptions} onElementsClick={this.chartElemClick.bind(this, chartData)}/>
        </td>
      </tr>
    ];
  }
}