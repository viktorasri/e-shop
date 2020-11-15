import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const SearchBox = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      history.push(`/search/${encodeURIComponent(query)}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form inline onSubmit={submitHandler}>
      <Form.Control
        type='search'
        name='q'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search products...'
        className='mr-sm-2 ml-sm-5'
      />
      <Button className='p-2' variant='outline-success' type='submit'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
