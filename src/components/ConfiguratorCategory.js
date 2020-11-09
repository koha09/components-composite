import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ConfiguratorItem from "./ConfiguratorItem"
import ProductList from './ui/ProductList'
import {removeCart} from '../redux/actions'



class ConfiguratorCategory extends React.Component {
  constructor(props){
    super(props)
    this.onAddProductToCart = this.onAddProductToCart.bind(this)
    this.onChangePage = this.onChangePage.bind(this)
    this.state = {
      items: {},
      page: 1,
      choosedItem: null,
      canLoad: true,
      canShow: false
    }
  }
  componentDidMount(){
    this.getData()
  }
  componentDidUpdate(nextProps){
    if(this.props.query.length != nextProps.query.length && this.state.choosedItem === null){
      this.getData();
    }
  }
  // Listeners
  onAddProductToCart(choosedItem) {
    this.setState({ ...this.state, choosedItem })
  }
  onChangePage(page){
    this.setState({ ...this.state, page, canLoad: true }, () => {
      this.getData(this.state.page)
    })
  }
  getData (page = 1) {
    this.setState({...this.state,canLoad: true})
    const { data,query } = this.props
    const parameters = {
      page: page,
      terms:query
    };
    // url.search = new URLSearchParams(parameters).toString()
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    var raw = JSON.stringify(parameters);
    
    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${window.location.origin}/wp-json/constructor/v1/get-products-by-categories/${data.slug}`, requestOptions)
      .then((response) => response.json())
      .then((items) => {
        this.setState({
          ...this.state,
          items,
          query,
          canLoad: false,
        });
      });
  }

  render() {
    const {items,canLoad,choosedItem,page} = this.state
    const data = this.props.data

    if (!canLoad) {
      if(items.products?.length ?? 0)
      return (
        <React.Fragment>
          <ProductList
            title={data.title}
            onChangePage={this.onChangePage}
            page={page}
            choosed={choosedItem}
            onClickRemove={() => {
              this.props.dispatch(removeCart(choosedItem));
              this.setState({ ...this.state, choosedItem: null });
            }}
            canShow={this.state.canShow}
            count={items.max_num_pages}
            setCanShow={(show)=>this.setState({...this.state,canShow: show})}
          >
            {items.products.map((item) => (
              <ConfiguratorItem
                key={item.id}
                data={item}
                onAddProductToCart={this.onAddProductToCart}
              />
            ))}
          </ProductList>
        </React.Fragment>
      );
      else return (
        <div className='main-products main-products-list js-columns-result columns-6' data-columns="6">
            <div style={styles.header}>
                <h2 style={styles.header__title}>{data.title}</h2>
            </div>
            <div>Нет подходящих товаров</div>
        </div>
      )
    }
    // Show loading
    else return (
      <div className='main-products main-products-list js-columns-result columns-6' data-columns="6">
        <div style={styles.header}>
            <h2 style={styles.header__title}>{data.title}<img style={styles.spinner} src='/wp-content/themes/azone/assets/images/loader.gif'></img></h2>
        </div>
    </div>
    )
  }
}

const styles = {
  header: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10,
      alignItems: 'center',
      background: '#f8f8f8',
      border: '1px solid #e1e1e1',
      
  },
  spinner:{
    height: '30px',
    margin: '10px'
  },
  header__title: {
      margin: 0,
      fontSize: 22,
      marginLeft: 12,
      lineHeight: '50px'
  },
};


ConfiguratorCategory.propTypes = {
  data: PropTypes.object.isRequired,
  query: PropTypes.array.isRequired,
}

export default connect(null,null)(ConfiguratorCategory)
