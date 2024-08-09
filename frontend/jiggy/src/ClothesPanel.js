import React from 'react';
import './ClothesPanel.css';

const ClothesPanel = ({ id, name, price, image_url, category }) => {
    return (
        <div className="clothes-panel">
            <img src={image_url} alt={name} className="clothes-image" />
            <div className="clothes-info">
                <h3 className="clothes-name">{name}</h3>
                <p className="clothes-category">{category}</p>
                <p className="clothes-price">${price}</p>
            </div>
            <button className="heart-button">❤️</button>
        </div>
    );
};

export default ClothesPanel;