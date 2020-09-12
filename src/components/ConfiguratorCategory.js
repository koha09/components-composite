import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';

class ConfiguratorGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginLeft: 20}}>
                <div>
                    <a className={'configuration-product'} onClick={this.props.onChangeStateProductInCart}>
                        <strong>Название:</strong> {this.props.data.name}
                    </a>
                </div>
                <button onClick={()=>this.props.onChangeStateProductInCart(this.props.id,this.props.data)}>{this.props.data.in_cart ? 'Убрать' : 'Добавить'}</button>
            </div>
        )
    }

}

ConfiguratorGroup.propTypes = {
    data: PropTypes.object.isRequired,
    onChangeStateProductInCart: PropTypes.func.isRequired
}
export default ConfiguratorGroup