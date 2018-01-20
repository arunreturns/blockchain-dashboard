import React from 'react';
import './App.css';
import axios from 'axios';
import DashRow from './components/DashRow';
import Chart from './components/Chart';
import Loading from './components/Loading';

const apiPath = process.env.REACT_APP_API_ROOT || "";

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      currencies: [],
      currencyInfo: {},
      currencyData: {},
      selectedCurrency: {}
    };
    
    this.renderDashboard = this.renderDashboard.bind(this);
    this.getCurrencyInfo = this.getCurrencyInfo.bind(this);
    this.renderCurrencyInfo = this.renderCurrencyInfo.bind(this);
    this.updateCurrencyData = this.updateCurrencyData.bind(this);
  }

  componentDidMount(){
    let self = this;
    axios.get(apiPath + '/list').then(function(response){
      self.setState({
        currencies: response.data || []
      });
    }).catch((e) => {
      //console.log(e);
    });
  }

  getCurrencyInfo(currency){
    let self = this;
    self.setState({
      selectedCurrency: `${currency.name}`
    });
    if ( !this.state.currencyInfo[currency.name] ) {
      axios.get(apiPath + '/info/' + currency.name).then(function(response){
        let { currencyData, currencyInfo } = self.state;
        currencyInfo[currency.name] = response.data;
        currencyData[currency.name] = currency;
        currencyData[currency.name].selected_price = currencyData[currency.name].selected_price || currency.price_usd;
        currencyData[currency.name].type = 'price_usd';
        currencyData[currency.name].range = 1;
        self.setState({
          currencyInfo,
          currencyData,
          selectedCurrency: `${currency.name}`
        });
        self.forceUpdate();
      });
    }
  }

  updateCurrencyData(currencyData){
    this.setState({currencyData});
  }
  
  renderCurrencyInfo(currencyId){
    let currencyData = this.state.currencyData[currencyId];
    if ( typeof currencyData === 'undefined' || Object.keys(currencyData).length === 0 )
      return false;
    return <li className="nav-item">
      <a className="nav-link">{currencyId} - {currencyData.selected_price}</a>
    </li>;
  }

  renderDashboard(currency, index){
    let showField = this.state.selectedCurrency === currency.name;
    let chartComp;
    if ( showField ){
      let currencyInfo = this.state.currencyInfo[currency.name];
      let currencyData = this.state.currencyData[currency.name];
      let chartData = {};
      if ( typeof currencyInfo !== 'undefined') {
        currencyInfo.sort(function(a, b){
          return new Date(b.last_upd) - new Date(a.last_upd);
        });
        let maxDate = Math.max.apply(Math, currencyInfo.map(function(o){return new Date(o.last_upd).getTime();}));
        var currentDate = new Date(maxDate);
        currentDate.setDate(currentDate.getDate() - currencyData.range);
        chartData = currencyInfo.filter((row) => {
          return new Date(row.last_upd).getTime() > currentDate.getTime(); 
        });
        chartData = chartData.map(item => item[currencyData.type]);
        chartComp = <Chart chartData={chartData} currencyData={this.state.currencyData} selectedCurrency={this.state.selectedCurrency} updateCurrencyData={this.updateCurrencyData} />;
      } else {
        chartComp = <Loading />;
      }
    }
    
    return [
      <DashRow currency={currency} getCurrencyInfo={this.getCurrencyInfo} />,
      showField ? chartComp : false
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
