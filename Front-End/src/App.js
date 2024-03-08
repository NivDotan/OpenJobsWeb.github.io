import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import FilterButton from './FilterButton';
import DeleteButton from './DeleteAndCopyButton';
import {selectAllFromTable, GetStudentJuniorTAAndHaifaJSON} from './ServerFunctions.js'
const { createClient } = require('@supabase/supabase-js')

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const supabase = createClient('https://opnfoozwkdnolacljfbo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbmZvb3p3a2Rub2xhY2xqZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjUzNjUsImV4cCI6MjAyNTE0MTM2NX0.D7pAw1ZVlZ9bkC_16HSHkrL5MinsPHPFTaaj9uV1cwI')

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get('http://localhost:3001');
        //const { data, error } = await supabase.from('jobsfromtelegram').select('*');
        //const{data,error} = await selectAllFromTable();
        //setData(response.data);
        
        const data1 = await selectAllFromTable();
        //console.log(data1);
        setData(data1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  const handleFilterButtonClick = async () => {
    try {
      //const response = await axios.get('http://localhost:3001/GetStudentJuniorTAAndHaifa');
      const response = await GetStudentJuniorTAAndHaifaJSON();
      //setFilteredData(response.data);
      console.log(response);
      //setData(response);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleDeleteButtonClick = async () => {
    try {
      const response = await axios.get('http://localhost:3001/DeleteAndContinue');
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  return (
    <div className="modern-container">
      <div className="button-container">
        <FilterButton onClick={handleFilterButtonClick} />
        <DeleteButton onClick={handleDeleteButtonClick} />
      </div>
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
          {(filteredData.length > 0 ? filteredData : data).length > 0 ? (
            (filteredData.length > 0 ? filteredData : data).map((item) => (
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
            ))
          ) : (
            <Tr>
              <Td colSpan="5">No data available</Td>
            </Tr>
          )}
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

