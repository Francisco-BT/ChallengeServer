import { useState } from 'react';
import { Table } from 'react-bootstrap';

import Pagination from './pagination';

export default function CustomTable({ children }) {
  return (
    <>
      <Table striped bordered hover responsive>
        {children}
      </Table>
      <Pagination />
    </>
  );
}
