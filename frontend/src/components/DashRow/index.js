import React from 'react';

export default class DashRow extends React.Component {
  
  formatCurrency(priceField){
    return priceField.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  render(){
    let currency = this.props.currency;
    let id = `${currency.name}`;
    return (
      <tr key={id} className='RowSelect' onClick={this.props.getCurrencyInfo.bind(this, currency)}>
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
      </tr>
    );   
  }
}