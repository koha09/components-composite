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
            .then((link)=> location.href='https://elsie.store/cart-2/')
            .catch((ex) => {
                console.error(ex)
            })
    }
    if(items.length) {
        return (
            <div style={styles.configurator}>
                <div>В сборку включены: <i>{items.map(it=>it.name).join(', ')}</i></div>
                <div>На общую сумму <strong>{items.map(it=>it.price).reduce((a,b)=>parseInt(a)+parseInt(b))} руб.</strong></div>
                <button style={styles.action} onClick={() => onClick()}>Собрать</button>
            </div>
        )
    }else{
        return (
          <div style={styles.configurator}>
            <div style={styles.content}>
              <div style={styles.empty}>
                Добавьте комплектующие в конфигуратор
              </div>
            </div>
          </div>
        );
    }
}
ConfiguratorInfo.propTypes = {
    items: PropTypes.array.isRequired
}

let styles = {
    configurator:{
        minHeight: '80px',
        background: '#f8f8f8',
        border: '1px solid #e1e1e1',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    empty:{

    },
    content:{

    },
    action: {
        padding: '.2em 2em',
        marginTop: '1em'
    }

}

export default ConfiguratorInfo
