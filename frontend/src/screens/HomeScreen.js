import React,  { useState, useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import Axios from 'axios'

import Product from '../components/Product';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const {data} = await Axios.get('/api/products');
                setProducts(data);
            } catch (error) {
                console.log(error)
            }
        }

        fetchProducts();
    },[]);

    return (
        <>
            <h1>Latest products</h1>
            <Row>
                {products.map(product => {
                    return (
                        <Col key={product._id} sm={12} md={6} lg={4}>
                            <Product  product={product} />
                        </Col>
                    )
                })}
            </Row>    
        </>
    )
}

export default HomeScreen
