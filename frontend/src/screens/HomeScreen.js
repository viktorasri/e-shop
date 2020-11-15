import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { query, page } = match.params;
  const productList = useSelector((state) => state.productList);
  const { loading, products, error, pagination } = productList;

  useEffect(() => {
    dispatch(listProducts(query, page));
  }, [dispatch, query, page]);

  return (
    <>
      <h1>Latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => {
              return (
                <Col key={product._id} sm={12} md={6} lg={4}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
          {pagination && <Paginate total={pagination.total} page={pagination.page} />}
        </>
      )}
    </>
  );
};

export default HomeScreen;
