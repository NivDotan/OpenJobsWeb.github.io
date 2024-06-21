import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import FilterButton from './components/FilterButton.js';
import DeleteButton from './components/DeleteAndCopyButton.js';
import AllJobsPosting from './components/AllJobsPostingButton.js';
import Swal from 'sweetalert2';
import './App.css'; // Import the CSS file
import {selectAllFromTable, CopyAndDelete ,GetStudentJuniorTAAndHaifa, CopyAndDelete2, validatePassword, getDistinctDate} from './api/ServerFunctions.js'
const { createClient } = require('@supabase/supabase-js')


const MyComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [filter, setFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [jobDescFilter, setJobDescFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dropdownsVisible, setDropdownsVisible] = useState({
    company: false,
    jobDesc: false,
    city: false,
    date: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await selectAllFromTable();
        setData(response);
        setCurrentData(response); // Set currentData initially to all jobs
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

    const handleAllJobsPostingButtonClick = async () => {
      try {
        await setCurrentData([]);
        const response = await selectAllFromTable();
        setData(response);
        setCurrentData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


  const handleFilterButtonClick = async () => {
    try {
      await setCurrentData([]);
      const response = await GetStudentJuniorTAAndHaifa();
      setFilteredData(response);
      setCurrentData(response);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };


  const handleDeleteButtonClick = () => {
    getDistinctDate();
    Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
            console.log(password)
            const isValid = await validatePassword(password);
    
            if (!isValid) {
                Swal.showValidationMessage('Incorrect password!');
            } else {
                await handlePasswordValidated();
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
};

async function handlePasswordValidated(){
  try {
      await setCurrentData([]);
      const response = await CopyAndDelete();
      response = await selectAllFromTable();
      setFilteredData(response);
      setCurrentData(response);
      Swal.fire('Success', 'Data copied and deleted successfully', 'success');
  } catch (error) {
      console.error('Error copying and deleting data:', error);
      Swal.fire('Error', 'An error occurred while deleting the data', 'error');
  }
};
  
  const resetFilters = () => {
    setCompanyFilter('');
    setJobDescFilter('');
    setCityFilter('');
    setDateFilter('');
  };

  const handleFilterChangeFilterBox = (event) => {
    const { value } = event.target;
  setFilter(value);
  if (value.toLowerCase() === '') {
    setCurrentData(data); // Show all data if 'All' is selected
  } else {
    filterData(value, companyFilter, jobDescFilter, cityFilter, dateFilter);
  }
  };


  const handleFilterChange = (event) => {
    const { value } = event.target;
  if (value.toLowerCase() === '') {
    setCurrentData(data); // Show all data if 'All' is selected
  } else {
    filterData(value, companyFilter, jobDescFilter, cityFilter, dateFilter);
  }
  };

  
  const handleDropdownChange = (event, setFilterFunction, dropdownKey) => {
    setFilterFunction(event.target.value);
    setDropdownsVisible({ ...dropdownsVisible, [dropdownKey]: false });
    filterData(filter, companyFilter, jobDescFilter, cityFilter, dateFilter);
  };

  const filterData = (textFilter, company, jobDesc, city, date) => {
    const filtered = data.filter(item =>
      (item.Company.toLowerCase().includes(textFilter.toLowerCase()) || 
       item.JobDesc.toLowerCase().includes(textFilter.toLowerCase()) || 
       item.City.toLowerCase().includes(textFilter.toLowerCase()) || 
       item.Date.toLowerCase().includes(textFilter.toLowerCase())) &&
      (company ? item.Company === company : true) &&
      (jobDesc ? item.JobDesc === jobDesc : true) &&
      (city ? item.City === city : true) &&
      (date ? item.Date === date : true)
    );
    setCurrentData(filtered);
  };

  const getUniqueValues = (key) => {
    return [...new Set(data.map(item => item[key]))];
  };

  const toggleDropdown = (key) => {
    setDropdownsVisible({
      ...dropdownsVisible,
      [key]: !dropdownsVisible[key],
    });
  };
  
  return (
    <div className="modern-container">
      <div className="button-container">
        <AllJobsPosting onClick={handleAllJobsPostingButtonClick} />
        <FilterButton onClick={handleFilterButtonClick} />
        <DeleteButton onClick={handleDeleteButtonClick} />
      </div>
      <div className="filter-container">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChangeFilterBox}
          placeholder="Search for jobs..."
        />
      </div>
    <div className="table-container filterable-table">
      <Table>
        <Thead>
          <Tr>
          <Th>
                <select name="company" value={companyFilter} onChange={(e) => handleFilterChange(e, setCompanyFilter)} >
                  <option value="">Company</option>
                  <option value="">All</option> {}
                  {getUniqueValues('Company').map((company, index) => (
                    <option key={index} value={company}>{company}</option>
                  ))}
                </select>
              </Th>
            <Th>Job Description</Th>
            <Th>City</Th>
            <Th>
                <select name="date" value={dateFilter} onChange={(e) => handleFilterChange(e, setDateFilter)}>
                  <option value="">Date</option>
                  <option value="">All</option> {}
                  {getUniqueValues('Date').map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
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
    <div className="table-container regular-table">
      <Table>
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
            {currentData.length > 0 ? (
              currentData.map((item) => (
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

