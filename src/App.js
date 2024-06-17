import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import FilterButton from './FilterButton';
import DeleteButton from './DeleteAndCopyButton';
import AllJobsPosting from './AllJobsPostingButton.js';
import Swal from 'sweetalert2';
import {selectAllFromTable, CopyAndDelete ,GetStudentJuniorTAAndHaifa, CopyAndDelete2, validatePassword} from './ServerFunctions.js'
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

  //const handleDeleteButtonClick = async () => {
  //  try {
  //    await setCurrentData([]);
  //    const response = await CopyAndDelete();
  //    response = await selectAllFromTable();
  //    setFilteredData(response);
  //    setCurrentData(response);
  //  } catch (error) {
  //    console.error('Error fetching filtered data:', error);
  //  }
  //};

  const handleDeleteButtonClick = () => {
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterData(event.target.value, companyFilter, jobDescFilter, cityFilter, dateFilter);
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
          onChange={handleFilterChange}
          placeholder="Search for jobs..."
        />
      </div>
    <div className="table-container">
      <Table className="">
        <Thead>
          <Tr>
          <Th>
                <select name="company" value={companyFilter} onChange={(e) => handleFilterChange(e, setCompanyFilter)}>
                  <option value="">Company</option>
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

