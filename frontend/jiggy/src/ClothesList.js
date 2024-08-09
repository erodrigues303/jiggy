import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClothesPanel from './ClothesPanel';

const ClothesList = () => {
    const [clothes, setClothes] = useState([]);

    useEffect(() => {
        axios.get('/api/clothes')
            .then(response => setClothes(response.data))
            .catch(error => console.error('Error fetching clothes:', error));
    }, []);

    return (
        <div>
            {clothes.map(cloth => (
                <ClothesPanel
                    key={cloth.id}
                    id={cloth.id}
                    name={cloth.name}
                    price={cloth.price}
                    image_url={cloth.image_url}
                    category={cloth.category}
                />
            ))}
        </div>
    );
};

export default ClothesList;