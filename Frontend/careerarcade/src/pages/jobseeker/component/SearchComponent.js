import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Function to handle the search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    navigate(`/jobseeker/search-results?title=${encodeURIComponent(query)}`);
  };

  return (
    <div className="card p-3">
      <h4>Search for Jobs</h4>
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Enter job title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
    </div>
  );
};

export default SearchComponent;
