import React from 'react'
import PropTypes from "prop-types"

const Pagination = ({onChangePage,count,current})=>{
    console.log(current, count)
  const generatePagination = ()=>{
    const result = []

    if(current > 1 ) {
      result.push((
        <React.Fragment>
        <li>
          <a className="prev page-numbers" onClick={()=>onChangePage(current-1)}>Предыдущий</a>
        </li>
        <li>
          <a className="page-numbers" onClick={()=>onChangePage(current-1)}>{current-1}</a>
        </li>
        </React.Fragment>
      ))
    }
    result.push(
      (
        <li>
        <span aria-current="page" className="page-numbers current">
          {current}
        </span>
      </li>
      )
    )
    if(current+1 <= count) {
      result.push((
        <React.Fragment>
            <li>
            <a className="page-numbers" onClick={()=>onChangePage(current+1)}>{current+1}</a>
          </li>
          <li>
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
      {/*<p className="woocommerce-result-count">*/}
        {/*{" "}*/}
        {/*/!*<span>Showing 1–12</span> of 34 results*!/*/}
      {/*</p>*/}
    </div>
  );
}

Pagination.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired
}
export default Pagination
