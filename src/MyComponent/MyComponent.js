import React, { useEffect, useState } from 'react';
import FilterButton from '../components/FilterButton.js';
import DeleteButton from '../components/DeleteAndCopyButton.js';
import AllJobsPosting from '../components/AllJobsPostingButton.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
//const { createClient } = require('@supabase/supabase-js')
import '../App.css'; // Import the CSS file
import {getDistinctDate2, GetStudentJuniorTAAndHaifa2,CopyAndDeleteByDate,triggerCopyAndDeleteByDate, get_ip,selectAllFromTable2} from '../api/ServerFunctions.js'
import ScraperListings from '../Analytics/Analytics.js';

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [filter, setFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [jobDescFilter, setJobDescFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [distinctDates, setDistinctDates] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [dropdownsVisible, setDropdownsVisible] = useState({
      company: false,
      jobDesc: false,
      city: false,
      date: false,
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await selectAllFromTable2();
          //selectAllFromTable2();
          setData(response);
          setCurrentData(response); // Set currentData initially to all jobs
          get_ip();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); // Run only once on component mount
  
      const handleAllJobsPostingButtonClick = async () => {
        try {
          await setCurrentData([]);
          const response = await selectAllFromTable2();
          setData(response);
          setCurrentData(response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
  
    const handleFilterButtonClick = async () => {
      try {
  
        await setCurrentData([]);
        const response = await GetStudentJuniorTAAndHaifa2();
        setFilteredData(response);
        setCurrentData(response);
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    };
    
    const handleScraperListingsFilterButtonClick = () => {
      setModalOpen(true);
    };

    const handleModalClose = () => {
      setModalOpen(false);
    };
  
    const handleDeleteButtonClick = () => {
      getDistinctDate2();
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
              
            const email = 'nivdotan123@gmail.com'; // You should get this from the user input or session
            console.log('See:', JSON.stringify({ email, password }));
            try {
                // Send POST request to the Vercel API route to validate the password
                const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/validatePassword', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                    body: JSON.stringify({ password }),//, password }),
                });
                console.log('Data:', response);
                const data = await response.json();
                
                if (!response.ok) {
                    Swal.showValidationMessage(data.error || 'Something went wrong!');
                    return false;
                }
    
                // Handle success, for example, show date selection dialog
                await showDateSelectionDialog();
            } 
            catch (error) {
                console.error('Error during authentication:', error);
                Swal.showValidationMessage('Network error! Please try again.');
            }
        },
          allowOutsideClick: () => !Swal.isLoading()
      });
  };
  
  
  const getDistinctDates = () => {
    const dates = [...new Set(data.map(item => item.Date))];
    setDistinctDates(dates);
  };
  
  const showDateSelectionDialog = async () => {
    const distinctDates = await getDistinctDate2();
    console.log('Distinct dates:', distinctDates);
    const { value: selectedDates } = await Swal.fire({
      title: 'Select Dates to Delete',
      html: `
        <div id="date-selection-container">
          ${distinctDates.map(dateObj => `
            <div>
              <input type="checkbox" id="${dateObj.Date}" name="dates" value="${dateObj.Date}">
              <label for="${dateObj.Date}">${dateObj.Date}</label>
            </div>
          `).join('')}
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedDates = Array.from(document.querySelectorAll('input[name="dates"]:checked'))
          .map(checkbox => checkbox.value);
        return selectedDates.length ? selectedDates : Swal.showValidationMessage('You need to select at least one date');
      }
    });
    console.log('Selected dates:', selectedDates); 
    if (selectedDates) { // Check if selectedDates and selectedDates.value exist
      for (let i = 0, len = selectedDates.length; i < len; i++) {
        console.log('Selected dates:',i,' ', selectedDates[i]); 
        //await CopyAndDeleteByDate(selectedDates[i]);
        await triggerCopyAndDeleteByDate(selectedDates[i]);
      }
      handleDateDeletion();
  
  
      // Show loading spinner
      //Swal.fire({
      //  title: 'Processing...',
      //  text: 'Please wait while we process your request',
      //  allowOutsideClick: false,
      //  didOpen: () => {
      //    Swal.showLoading();
      //  }
      //});
  
      //// Simulate a function that processes the selected dates
      //// Replace this with your actual processing function
      //await processDates(selectedDates);
  
      //// Close the loading spinner and show success message
      //Swal.close();
      //Swal.fire('Success', 'Data copied and deleted successfully', 'success');
    }
  };
  
  // Simulated function to process dates
  const processDates = async (dates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing dates:', dates);
        resolve();
      }, 2000); // Simulate a 2 second processing time
    });
  };
  
  async function handleDateDeletion(){
    try {
        await setCurrentData([]);
        //const response = await CopyAndDelete();
        const response = await selectAllFromTable2();
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
          <ScraperListings open={isModalOpen} onClose={handleModalClose} />
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

  export default MyComponent;
  