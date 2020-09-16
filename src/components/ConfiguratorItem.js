import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { addCart } from '../redux/actions';

const ConfiguratorItem = ({onAddProductToCart,data})=>{
  const dispatch = useDispatch()
  return (
    <div style={{ marginLeft: 20 }}>
      <div>
        <a className={"configuration-product"}>
          <strong>Название:</strong> {data.name}
        </a>
      </div>
      <button onClick={()=>{
        onAddProductToCart(data)
        dispatch(addCart(data))
      }}>Добавить</button>
    </div>
  );
}

ConfiguratorItem.propTypes = {
    data: PropTypes.object.isRequired,
    onAddProductToCart: PropTypes.func.isRequired
}

export default connect(null,null)(ConfiguratorItem)