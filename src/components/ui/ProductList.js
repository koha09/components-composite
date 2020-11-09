import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Pagination from './Pagination'

const ProductList = ({children,title,choosed,onClickRemove,onChangePage,page,count,canShow,setCanShow})=>{
    if(choosed)
        return (
            <div className='main-products main-products-list js-columns-result columns-6' data-columns="6">
            <div style={styles.header}>
                <h2 style={styles.header__title}>{title}</h2>
                <span style={styles.header__product}>{choosed.name}</span>
                <span className="btn btn-danger" style={styles.header__btnRemove} onClick={onClickRemove}>&times;</span>
            </div>
        </div>
        )
    else
        {
            if(canShow){
                return (
                    <React.Fragment key={title}>
                        <div className='main-products main-products-grid js-columns-result columns-6' data-columns="6">
                            <div style={styles.header}>
                                <h2 style={styles.header__title}>{title}</h2>
                                <span style={styles.header__product}></span>
                                <button onClick={()=>setCanShow(false)}>Скрыть</button>                            
                            </div>                        
                            <ul className='products grid shop-page response-content clearfix equal-container better-height'>
                                {children}
                            </ul>
                        </div>
                        <Pagination onChangePage={onChangePage} current={page} count={count} />
                    </React.Fragment>
                )
            }else{
                return (
                    <div className='main-products main-products-list js-columns-result columns-6' data-columns="6">
                        <div style={styles.header}>
                            <h2 style={styles.header__title}>{title}</h2>
                            <span style={styles.header__product}></span>
                            <button onClick={()=>setCanShow(true)}>Показать</button>                            
                        </div>
                    </div>
                )
            }
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
  header__title: {
      margin: 0,
      fontSize: 22,
      marginLeft: 12
  },
  header__btnRemove: {
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center',
      padding: 0,
      borderRadius: 0
  },
};

ProductList.propsType = {
    title: PropTypes.string.isRequired,
    choosed: PropTypes.object,
    onClickRemove: PropTypes.func,
    onChangePage: PropTypes.func,
    page: PropTypes.number,
    count: PropTypes.number
}

export default ProductList