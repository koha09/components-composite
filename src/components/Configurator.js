import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import ConfiguratorCategory from "./ConfiguratorCategory"
import ConfiguratorInfo from "./ConfiguratorInfo"

function Configurator({ categories, cart}) {
  if (categories.length === 0) {
    return (
      <div>
        <h3>Происходит загрузка данных...</h3>
      </div>
    )
  }
  return (
    <React.Fragment>
      <ConfiguratorInfo items={cart} />
      {
        // Loop of categories
        categories.map((category) => {
          // Make query
          const query = category.terms
            .map((term) => {
              return cart.reduce((ac, item) => {
                if(item["attributes"][term]){
                  return {
                    name: item["attributes"][term].name,
                    value: item["attributes"][term].options[0]
                  }
                }else{
                  return ac
                }
              }, null)
            })
            .filter((it) => it != null)
            console.log(query)

          return (
            <ConfiguratorCategory
              key={category.slug}
              data={category}
              query={query}
            />
          )
        })
      }
    </React.Fragment>
  )
}


const mapProps = (state) => {
  return {
    categories: state.categories,
    cart: state.cart
  }
}
const connectToStore = connect(mapProps,null)
export default connectToStore(Configurator)