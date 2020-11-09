import React from 'react'
import PropTypes from "prop-types"

const Pagination = ({onChangePage,count,current})=>{
  const generatePagination = ()=>{
    const result = []

    if(current > 1 ) {
      result.push((
        <React.Fragment>
        <li key={'prev'}>
          <a className="prev page-numbers" onClick={()=>onChangePage(current-1)}>Предыдущий</a>
        </li>
        <li key={`${current-1}`}>
          <a className="page-numbers" onClick={()=>onChangePage(current-1)}>{current-1}</a>
        </li>
        </React.Fragment>
      ))
    }
    result.push(
      (
        <li key={`${current}`}>
        <span aria-current="page" className="page-numbers current">
          {current}
        </span>
      </li>
      )
    )
    if(current+1 <= count) {
      result.push((
        <React.Fragment>
          <li key={`${current+1}`}>
            <a className="page-numbers" onClick={()=>onChangePage(current+1)}>{current+1}</a>
          </li>
          <li key={'next'}>
            <a className="next page-numbers" onClick={()=>onChangePage(current+1)}>Следующая</a>
          </li>        
        </React.Fragment>
      ))
    }
    return result
  }
  
  return (
    <div className="shop-control shop-after-control">
      <nav className="woocommerce-pagination">
        <div className="woocommerce-pagination pagination-nav type-pagination">
          <ul className="page-numbers">
            {
              generatePagination()
            }
          </ul>
        </div>
      </nav>
    </div>
  );
}

Pagination.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired
}
export default Pagination
