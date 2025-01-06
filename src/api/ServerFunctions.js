
function convertDateFormat(originalDate) {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
}


export async function selectAllFromTable2() {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/getData'); // Replace with your actual Vercel URL
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data fetched from serverless function:', data);
    return data;
  } 
  catch (error) {
    console.error('Error fetching data from serverless function:', error);
    throw error;
  }
}




export async function GetStudentJuniorTAAndHaifa2() {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/GetStudentJuniorTAAndHaifa'); // Replace with your actual Vercel URL
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data fetched from serverless function:', data);
    return data;
  } 
  catch (error) {
    console.error('Error fetching data from serverless function:', error);
    throw error;
  }
}





export async function validatePassword2(password){
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/validatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
}





  export async function getDistinctDate2() {
    try {
      const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/getDistinctDate'); // Replace with your actual Vercel URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data fetched from serverless function:', data);
      return data;
    } 
    catch (error) {
      console.error('Error fetching data from serverless function:', error);
      throw error;
    }
  }


export async function triggerCopyAndDeleteByDate(date) {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/copyAndDeleteByDate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })   
    });
    
    const result = await response.json();
    if (response.ok) {
      console.log('Operation successful:', result.message);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

export async function get_ip() {
    try {
        // Use a third-party API to get the IP address
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Failed to fetch IP address');
        }
        const data = await response.json();
        const ip_address = data.ip;
        const device_info = getDeviceInfo();
        const browser = getDeviceInfo() + ", " + getBrowserAndOS();
        const last_visit = new Date().toISOString();
        //const insertPayload = { IP_address: ipAddress };
        const payload = { ip_address: ip_address, 
                          device_info: device_info, 
                          browser_and_os: browser, 
                          last_visit: last_visit };
        
        
        const serverResponse = await fetch('https://vercel-serverless-functions3.vercel.app/api/HandlingIPaddresses', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
          });

        if (!serverResponse.ok) {
            throw new Error('Failed to insert or update IP address in the database');
        }
        console.log('Server response:', serverResponse);
        const result = await serverResponse;
        

        
    } catch (error) {
        console.error('Error fetching or inserting IP address:', error);
        throw error;
    }
}

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod/.test(userAgent)) {
      console.log('Mobile');
      return userAgent + " " + 'Mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return userAgent + " " + 'Tablet';
    } else {
      return userAgent + " " + 'Desktop';
    }
  }

  function getBrowserAndOS() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
  
    // Detect browser
    let browser;
    if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browser = 'Internet Explorer';
    } else {
      browser = 'Other';
    }
  
    // Detect OS
    let os;
    if (platform.startsWith('Win')) {
      os = 'Windows';
    } else if (platform.startsWith('Mac')) {
      os = 'macOS';
    } else if (platform.startsWith('Linux')) {
      os = 'Linux';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      os = 'iOS';
    } else {
      os = 'Other';
    }
    //console.log(`Browser: ${browser}, OS: ${os}`);
    return `Browser: ${browser}, OS: ${os}`;
    
  }

  function trackUserActions() {
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        console.log(`Button clicked: ${button.innerText}`);
      });
    });
    }

