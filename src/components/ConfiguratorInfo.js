import React from 'react'
import PropTypes from 'prop-types'

const ConfiguratorInfo = ({items}) => {
    const onClick = () => {
        fetch('/wp-json/constructor/v1/create-order',
            {
                method: 'POST',
                body: JSON.stringify({'ids': items.map(i => i.id)})
            })
            .then((response) => response.text())
            .then((link)=> location.href=link)
            .catch((ex) => {
                console.error(ex)
            })
    }
    return (
        <div>
            <strong>
                {
                    items
                        .map(it => it.name)
                        .join(',')
                }
            </strong>
            <button onClick={() => onClick()}>Собрать</button>
        </div>
    )
}
ConfiguratorInfo.propTypes = {
    items: PropTypes.array.isRequired
}

export default ConfiguratorInfo
