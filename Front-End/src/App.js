import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import FilterButton from './FilterButton';


const MyComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001');
        
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  const handleFilterButtonClick = async () => {
    try {
      const response = await axios.get('http://localhost:3001/GetStudentJuniorTAAndHaifa');
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  return (
    <div className="modern-container">
      <FilterButton  onClick={handleFilterButtonClick}/>
    <div className="table-container">
      <Table className="">
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
          {(filteredData.length > 0 ? filteredData : data).map((item) => (
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
    </div>
  );
};

const App = () => {
  return (
    <div className="app-container">
      <MyComponent />
    </div>
  );
};

export default App;

