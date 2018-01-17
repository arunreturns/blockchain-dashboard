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
      collapseContent: {}
    };
    
    this.renderDashboard = this.renderDashboard.bind(this);
    this.getCurrencyInfo = this.getCurrencyInfo.bind(this);
    this.renderCurrencyInfo = this.renderCurrencyInfo.bind(this);
  }
  
  componentDidMount(){
    let self = this;
    axios.get('http://nodeserver-arunreturns.c9.io:8081/list').then(function(response){
      self.setState({
        currencies: response.data
      });
    });
  }
  
  getCurrencyInfo(currency){
    let self = this;
    axios.get('http://nodeserver-arunreturns.c9.io:8081/info/' + currency.name).then(function(response){
      let currencyInfo = self.state.currencyInfo;
      currencyInfo[currency.name] = response.data;
      self.setState({
        currencyInfo,
        collapseContent: `${currency.name}`
      });
    });
  }
  
  renderCurrencyInfo(currencyId){
    console.log("[renderCurrencyInfo]", currencyId)
    let currencyInfo = this.state.currencyInfo[currencyId];
    if ( typeof currencyInfo === 'undefined' || Object.keys(currencyInfo).length === 0 )
      return false;
    return <li className="nav-item">
      <a className="nav-link">{currencyId} - {currencyInfo.price_usd}</a>
    </li>;
  }
  formatCurrency(priceField){
    return priceField.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  renderDashboard(currency, index){
    let id = `${currency.name}-${index}`;
    let showField = this.state.collapseContent === currency.name ;
    let currencyData = this.state.currencyInfo[currency.name];
    let currencyPrices24H, currencyVolume24H;
    let labels;
    if ( typeof currencyData !== 'undefined') {
      let maxDate = Math.max.apply(Math, currencyData.map(function(o){return new Date(o.last_upd).getTime();}));
      console.log("Max Date", maxDate);
      var currentDate = new Date(maxDate);
      currentDate.setDate(currentDate.getDate() - 1);
      let currency24H = currencyData.filter((row) => {
        return new Date(row.last_upd).getTime() > currentDate.getTime(); 
      });
      currentDate = new Date(maxDate);
      currentDate.setDate(currentDate.getDate() - 7);
      let currency7D = currencyData.filter((row) => {
        return new Date(row.last_upd).getTime() > currentDate.getTime(); 
      });
      currentDate = new Date(maxDate);
      currentDate.setDate(currentDate.getDate() - 30);
      let currency30D = currencyData.filter((row) => {
        return new Date(row.last_upd).getTime() > currentDate.getTime(); 
      });
      
      currentDate = new Date("20-11-2017");
      currentDate.setDate(currentDate.getDate() - 30);
      let currencyCustom = currencyData.filter((row) => {
        return new Date(row.last_upd).getTime() > currentDate.getTime(); 
      });
      console.log(currency24H);
      console.log(currency7D);
      console.log(currency30D);
      console.log(currencyCustom);
      
      currencyPrices24H = currency24H.map(item => item.price_usd);
      currencyVolume24H = currency24H.map(item => item.volume_usd_24h);
      labels = currency24H.map(item => item.last_upd);
    }
    
    var data = {
      labels: labels,
    	datasets: [
    		{
    			label: "Volume",
    			fillColor: "rgba(151,187,205,0.2)",
    			strokeColor: "rgba(151,187,205,1)",
    			pointColor: "rgba(151,187,205,1)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "#fff",
    			pointHighlightStroke: "rgba(151,187,205,1)",
    			data: currencyPrices24H
    		}
    	]
    };
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
      showField ? <tr key={id + "collapse"}>
        <td colSpan="6">
          <LineChart data={data} />
        </td>
      </tr> : false
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
