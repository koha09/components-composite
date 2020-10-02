import React from 'react'

const ProductItem = ({product,children})=>{
    const {name,description,image,id,sku,link} = product
    return (
      <li className="product-item product type-product status-publish js-columns-result ">
        <div className="product-inner">
          <div className="product-thumb images">
            <a
              href={link}
              className="thumb-link woocommerce-product-gallery__image"
              dangerouslySetInnerHTML={{__html: image}}
            >
            </a>
          </div>
        <div className="product-info">
          <h3 className="product-title">
            <a href={link}>{name}</a>
          </h3>
          <div className="excerpt">{description}</div>
          <div className="add-to-cart" data-original-title="" title="">
            {children}
          </div>
        </div>
        </div>
      </li>
    );
}
export default ProductItem