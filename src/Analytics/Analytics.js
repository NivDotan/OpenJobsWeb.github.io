import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Typography,styled,Dialog,CircularProgress,DialogTitle,DialogContent,DialogActions,Button,IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.common.white,
  backgroundColor: '#3f51b5', // A shade of blue, change as needed
  '&:hover': {
    backgroundColor: '#303f9f', // Darker shade on hover
  },
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1.2rem', // Increase font size for header
  fontWeight: 'bold',  // Make it bold
  textAlign: 'center',  // Center align text
  color: theme.palette.common.white,
  backgroundColor: '#3f51b5',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ScraperListings = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false); // State for modal visibility
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/fetchScraperJobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setJobs(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching job data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Most Updated Jobs
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent sx={{ p: 0 }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: '70vh', overflowY: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ textAlign: 'center' , fontWeight: 'bold'}}>Job Title</StyledTableCell>
                    <StyledTableCell style={{ textAlign: 'center' , fontWeight: 'bold'}}>Company</StyledTableCell>
                    <StyledTableCell style={{ textAlign: 'center' , fontWeight: 'bold'}}>Location</StyledTableCell>
                    <StyledTableCell style={{ textAlign: 'center' , fontWeight: 'bold'}}>Link</StyledTableCell>
                    <StyledTableCell style={{ textAlign: 'center' , fontWeight: 'bold'}}>Date Posted</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.job_name}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.city}</TableCell>
                      <TableCell>
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3f51b5', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                          Apply
                        </a>
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{new Date(job.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit'
  }) +
    '/' +
    new Date(job.created_at).getFullYear().toString().slice(-2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default ScraperListings;