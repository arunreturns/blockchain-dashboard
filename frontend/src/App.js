import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
const LineChart = require("react-chartjs").Line;

class App extends Component {
  constructor(){
    super();
    this.state = {
      currencies: [],
      currencyInfo: {},
      currencyData: {},
      collapseContent: {}
    };
    
    this.renderDashboard = this.renderDashboard.bind(this);
    this.getCurrencyInfo = this.getCurrencyInfo.bind(this);
    this.renderCurrencyInfo = this.renderCurrencyInfo.bind(this);
  }
  
  componentDidMount(){
    let self = this;
    axios.get('/list').then(function(response){
      self.setState({
        currencies: response.data || []
      });
    }).catch((e) => {
      console.log(e);
    });
  }
  
  getCurrencyInfo(currency){
    let self = this;
    axios.get('/info/' + currency.name).then(function(response){
      let { currencyData, currencyInfo } = self.state;
      currencyInfo[currency.name] = response.data;
      currencyData[currency.name] = currency;
      self.setState({
        currencyInfo,
        currencyData,
        collapseContent: `${currency.name}`
      });
    });
  }
  
  renderCurrencyInfo(currencyId){
    console.log("[renderCurrencyInfo]", currencyId);
    let currencyData = this.state.currencyData[currencyId];
    if ( typeof currencyData === 'undefined' || Object.keys(currencyData).length === 0 )
      return false;
    return <li className="nav-item">
      <a className="nav-link">{currencyId} - {currencyData.price_usd}</a>
    </li>;
  }
  
  formatCurrency(priceField){
    return priceField.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  setType(type){
    this.setState({type});
  }
  
  setRange(range){
    this.setState({range});
  }
  
  generateLabels(range){
    if ( range === 1 ){
      return Array(12).fill(1).map((i, idx) => idx + 1);
    }
  }
  
  renderDashboard(currency, index){
    let id = `${currency.name}-${index}`;
    let showField = this.state.collapseContent === currency.name ;
    let currencyInfo = this.state.currencyInfo[currency.name];
    let chartData;
    let chartRows;
    if ( typeof currencyInfo !== 'undefined') {
      currencyInfo.sort(function(a, b){
        return new Date(b.last_upd) - new Date(a.last_upd);
      });
      let maxDate = Math.max.apply(Math, currencyInfo.map(function(o){return new Date(o.last_upd).getTime();}));
      console.log("Max Date", maxDate);
      var currentDate = new Date(maxDate);
      currentDate.setDate(currentDate.getDate() - this.state.range);
      chartData = currencyInfo.filter((row) => {
        return new Date(row.last_upd).getTime() > currentDate.getTime(); 
      });
      chartData = chartData.map(item => item[this.state.type]);
      console.log('[chartData]', chartData);
      let chartOptions = {
      	///Boolean - Whether grid lines are shown across the chart
      	scaleShowGridLines : true,
      
      	//String - Colour of the grid lines
      	scaleGridLineColor : "rgba(0,0,0,.05)",
      
      	//Number - Width of the grid lines
      	scaleGridLineWidth : 1,
      
      	//Boolean - Whether to show horizontal lines (except X axis)
      	scaleShowHorizontalLines: true,
      
      	//Boolean - Whether to show vertical lines (except Y axis)
      	scaleShowVerticalLines: true,
      
      	//Boolean - Whether the line is curved between points
      	bezierCurve : true,
      
      	//Number - Tension of the bezier curve between points
      	bezierCurveTension : 0.4,
      
      	//Boolean - Whether to show a dot for each point
      	pointDot : false,
      
      	//Number - Radius of each point dot in pixels
      	pointDotRadius : 4,
      
      	//Number - Pixel width of point dot stroke
      	pointDotStrokeWidth : 1,
      
      	//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      	pointHitDetectionRadius : 4,
      
      	//Boolean - Whether to show a stroke for datasets
      	datasetStroke : true,
      
      	//Number - Pixel width of dataset stroke
      	datasetStrokeWidth : 2,
      
      	//Boolean - Whether to fill the dataset with a colour
      	datasetFill : true,
      
      	//Boolean - Whether to horizontally center the label and point dot inside the grid
      	offsetGridLines : false
      };
      let data = {
        labels: [],
      	datasets: [
      		{
      			label: "Volume",
      			fillColor: "rgba(151,187,205,0.2)",
      			strokeColor: "rgba(151,187,205,1)",
      			//pointColor: "rgba(151,187,205,1)",
      			//pointStrokeColor: "#fff",
      			//pointHighlightFill: "#fff",
      			//pointHighlightStroke: "rgba(151,187,205,1)",
      			data: chartData
      		}
      	]
      };
      chartRows = [ <tr>
        <td colSpan='3'>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={this.state.type === 'price_usd' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.type === 'price_usd'} onClick={this.setType.bind(this, 'price_usd')} autoComplete="off" /> Price
            </label>
            <label className={this.state.type === 'market_cap_usd' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.type === 'market_cap_usd'} onClick={this.setType.bind(this, 'market_cap_usd')} autoComplete="off" /> Market Cap
            </label>
            <label className={this.state.type === 'volume_usd_24h' ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.type === 'volume_usd_24h'} onClick={this.setType.bind(this, 'volume_usd_24h')} autoComplete="off" /> Volume
            </label>
          </div>
        </td>
        <td colSpan='3'>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={this.state.range === 1 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.range === 1} onClick={this.setRange.bind(this, 1)} autoComplete="off" /> 24H
            </label>
            <label className={this.state.range === 7 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.range === 7} onClick={this.setRange.bind(this, 7)} autoComplete="off" /> 7 Days
            </label>
            <label className={this.state.range === 30 ? "btn btn-secondary active" : "btn btn-secondary"}>
              <input type="checkbox" checked={this.state.range === 30} onClick={this.setRange.bind(this, 30)} autoComplete="off" /> 30 Days
            </label>
          </div>
        </td>
      </tr>,
      <tr key={id + "collapse"}>
        <td colSpan="6">
          <LineChart key={id + 'chart'} ref={id + 'chart'} data={data} width="800px" options={chartOptions} />
        </td>
      </tr>
      ];
    }
    
    return [
      <tr key={id} onClick={this.getCurrencyInfo.bind(this, currency)}>
        <td>
          <label>{currency.name}</label>
        </td>
        <td>
          <label className={currency.percent_change_24h < 0 ? 'Red' : 'Green'}>{currency.percent_change_24h}</label>
        </td>
        <td>
          <label>{this.formatCurrency(currency.market_cap_usd)}</label>
        </td>
        <td>
          <label>{this.formatCurrency(currency.price_usd)}</label>
        </td>
        <td>
          <label>{currency.total_supply - currency.available_supply}</label>
        </td>
        <td>
          <label>{this.formatCurrency(currency.volume_usd_24h)}</label>
        </td>
      </tr>,
      showField ? chartRows : false
    ];
  }

  renderHeaders(){
    let headerNames = ['Currency', 'Change %24H', 'Market Cap', 'Price USD', 'Supply', 'Volume'];
    return headerNames.map(name => <th>{name.toUpperCase()}</th>);
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
            <ul className="nav nav-pills flex-column">
              { Object.keys(this.state.currencyInfo).map(this.renderCurrencyInfo) }
            </ul>
          </nav>
          <main className="col-sm-9 ml-sm-auto col-md-10 pt-3 Content">
            <h1>Dashboard</h1>
            <table className='table table-hover'>
              <thead>
                <tr>{this.renderHeaders()}</tr>
              </thead>
              <tbody>
                {this.state.currencies.map(this.renderDashboard)}
              </tbody>
            </table>
            
          </main>
        </div>
      </div>
    );
  }
}

export default App;
