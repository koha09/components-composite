import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ConfiguratorItem from "./ConfiguratorItem"
import {removeCart} from '../redux/actions'



class ConfiguratorCategory extends React.Component {
  constructor(props){
    super(props)
    this.onAddProductToCart = this.onAddProductToCart.bind(this)
    this.onClickNextPage = this.onClickNextPage.bind(this)
    this.onClickPreviousPage = this.onClickPreviousPage.bind(this)
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
  onClickPreviousPage() {
    this.setState({ ...this.state, page: this.state.page - 1, canLoad: true }, () => {
      this.getData(this.state.page)
    })
  }
  onClickNextPage() {
    this.setState({ ...this.state, page: this.state.page + 1, canLoad: true }, () => {
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
    const {items,canLoad,choosedItem,page} = this.state;
    const data = this.props.data
    if (items.products && !canLoad) {
      if (choosedItem) {
        // Render if own products is selected
        return (
          <div className={"configuration-group"}>
            <h2 className={"configuration-group__title"}>{data.title}</h2>
            <span>Выбран: {choosedItem.name}</span>
            <button
              onClick={() => {
                this.props.dispatch(removeCart(choosedItem))
                this.setState({ ...this.state, choosedItem: null })
              }}
            >
              X
            </button>
          </div>
        )
      } else {
        // Render category products
        return (
          <div className={"configuration-group"}>
            <h2 className={"configuration-group__title"}>{data.title}</h2>
            <div className={"configuration-group__list"}>
              {items.products.map((item) => (
                <ConfiguratorItem
                  key={item.id}
                  data={item}
                  onAddProductToCart={this.onAddProductToCart}
                />
              ))}
            </div>
            <div className="pagination">
              <button
                disabled={page == 1}
                className="pagination__action btn-secondary"
                onClick={this.onClickPreviousPage}
              >
                {"<"}
              </button>
              <div className="pagination__counter">{page}</div>
              <button
                disabled={page >= items.max_num_pages}
                className="pagination__action"
                onClick={this.onClickNextPage}
              >
                {">"}
              </button>
            </div>
          </div>
        )
      }
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
