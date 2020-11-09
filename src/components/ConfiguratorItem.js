import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { addCart } from '../redux/actions';
import ProductItem from './ui/ProductItem';

const ConfiguratorItem = ({onAddProductToCart,data})=>{
  const dispatch = useDispatch()
  return (
    <ProductItem product={data}>
      <button style={styles.action} onClick={()=>{
        onAddProductToCart(data)
        dispatch(addCart(data))
      }}>Добавить</button>
    </ProductItem>
  );
}

ConfiguratorItem.propTypes = {
    data: PropTypes.object.isRequired,
    onAddProductToCart: PropTypes.func.isRequired
}
const styles = {
  action: {
        padding: '.2em 2em',
        marginTop: '1em'
  }
}
export default connect(null,null)(ConfiguratorItem)