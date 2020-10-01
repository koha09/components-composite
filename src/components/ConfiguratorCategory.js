import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ConfiguratorItem from "./ConfiguratorItem"
import ProductList from './ui/ProductList'
import Pagination from './ui/Pagination'
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
      canLoad: false,
    }
  }
  componentDidMount(){
    this.getData()
  }
  componentDidUpdate(prevProps){
    if(this.props.query != prevProps.query){
      this.getData()
    }
  }
  // Listeners
  onAddProductToCart(choosedItem) {
    this.setState({ ...this.state, choosedItem })
  }
  onChangePage(page){
    this.setState({ ...this.state, page, canLoad: true }, () => {
      console.log(this.state.page)
      this.getData(this.state.page)
    })
  }
  getData (page = 1) {
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
      .then((respData) => {
        this.setState({
          ...this.state,
          items: respData,
          query: query,
          canLoad: false,
        });
      });
  }

  render() {
    const {items,canLoad,choosedItem,page} = this.state
    const data = this.props.data

    if (items.products && !canLoad) {
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
            count={items.max_num_pages}
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
    }
    // Show loading
    else return (
      <div className={"configuration-group"}>
        <h2 className={"configuration-group__title"}>{data.title}</h2>
      <div>Идет загрузка</div>
      </div>
    )
  }
}

ConfiguratorCategory.propTypes = {
  data: PropTypes.object.isRequired,
  query: PropTypes.array.isRequired,
}

export default connect(null,null)(ConfiguratorCategory)
