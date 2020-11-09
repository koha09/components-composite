import React from 'react'

const ProductItem = ({product,children})=>{
    const {name,description,image,id,sku,link} = product
    return (
      <li className="product-item style-01 product type-product status-publish has-post-thumbnail shipping-taxable purchasable product-type-simple">
        <div className="product-inner">
          <div className="product-thumb images">
            <a
              href={link}
              className="thumb-link woocommerce-product-gallery__image"
              dangerouslySetInnerHTML={{__html: image}}
            >
            </a>
          </div>
        <div className="product-info equal-elem">
          <h3 className="product-title" style={styles.center}>
            <a href={link}>{name}</a>
          </h3>
          <div style={styles.center}>
            <small>Артикул: {sku}</small>
          </div>
          <div className="add-to-cart" data-original-title="" title="" style={styles.center}>
            {children}
          </div>
        </div>
        </div>
      </li>
    );
}

const styles = {
  center:{
    textAlign:"center"
  }
}
export default ProductItem