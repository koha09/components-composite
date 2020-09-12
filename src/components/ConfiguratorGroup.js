import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import ConfigurationCategory from "./ConfiguratorCategory";

class ConfiguratorGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
        this.onChangeStateProductInCart = this.onChangeStateProductInCart.bind(this)
    }

    componentDidMount() {
        fetch(`/wp-json/constructor/v1/get-products-by-categories/${this.props.name}`)
            .then((response) => response.json())
            .then((data) => {
                const items = data.map(item => {
                    item['in_cart'] = false
                    return item
                })
                this.setState({items});
            })
    }

    render() {
        return (
            <div className={'configuration-group'}>
                <h2 className={'configuration-group__title'}>{this.props.title}</h2>
                <div className={'configuration-group__list'}>{this.state.items.map(item =>
                    (<ConfigurationCategory key={item.id} data={item}
                                            onChangeStateProductInCart={this.onChangeStateProductInCart}/>)
                )}
                </div>
            </div>
        )
    }

    onChangeStateProductInCart(id, item) {
        console.log(this);
        const newValue = this.state.items.map(it => {
            if(it === item){
                it.in_cart = !item.in_cart
            }else{
                it.in_cart = false
            }
            return it
        });
        this.setState({items: newValue})
    }
}

ConfiguratorGroup.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}
export default ConfiguratorGroup