import React from 'react';

export const Select = ({ currency, onChange, currencyList }) => {
    return (
        <select className="select" value={currency} onChange={onChange}>
            {currencyList.map(elem => {
                return <option key={elem.split(",")[0]}>{elem}</option>
            })}
        </select>
    )
}