import React, {useState, useEffect} from 'react'
import ConfiguratorGroup from './ConfiguratorGroup'

class Configurator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: []
        }
    }

    componentDidMount() {
        fetch('/wp-json/constructor/v1/get-categories')
            .then((response) => response.json())
            .then((data) => this.setState({categories: data}))
    }

    render() {
        return (
            <div>
                {this.state.categories.map(item => (
                <ConfiguratorGroup key={item.name} title={item.title} name={item.name}/>))}
            </div>
        )
    }
}

export default Configurator