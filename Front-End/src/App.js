import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

function App(){
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001'); // Replace with your server URL
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table-container">
    <Table class = "responsiveTable">
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th>Job Description</Th>
            <Th>City</Th>
            <Th>Date</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.key}>
              <Td>{item.Company}</Td>
              <Td>{item.JobDesc}</Td>
              <Td>{item.City}</Td>
              <Td>{item.Date}</Td>
              <Td>
                <a href={item.Link} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default App;

