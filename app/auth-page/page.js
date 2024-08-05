// 'use client'
// import { useState } from 'react';
// import GoogleAuth from '../components/GoogleAuth';
// import SignIn from '../components/SignIn';
// import SignUp from '../components/SignUp';
// import { Box, Tabs, Tab } from '@mui/material';

// export default function AuthPage() {
//   const [tabValue, setTabValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 4 }}>
//       <Tabs value={tabValue} onChange={handleTabChange} centered>
//         <Tab label="Sign In" />
//         <Tab label="Sign Up" />
//       </Tabs>
//       <Box sx={{ mt: 2 }}>
//         <GoogleAuth />
//       </Box>
//       <Box sx={{ mt: 2 }}>
//         {tabValue === 0 && <SignIn />}
//         {tabValue === 1 && <SignUp />}
//       </Box>
//     </Box>
//   );
// }
// 'use client'
// import { useState } from 'react';
// import GoogleAuth from '../components/GoogleAuth';
// import SignIn from '../components/SignIn';
// import SignUp from '../components/SignUp';
// import { Box, Tabs, Tab } from '@mui/material';

// export default function AuthPage() {
//   const [tabValue, setTabValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box
//       sx={{
//         height: '100vh', // Full height of the viewport
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//       }}
//     >
//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: 600,
//           margin: 'auto',
//           backgroundColor: 'black',
//           borderRadius: 2, // 8px border-radius
//           color: 'white', // Silver color for text
//           padding: 3, // Optional padding
//           boxShadow: 3, // Optional box shadow for depth
//         }}
//       >
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           centered
//           sx={{ color: 'white' }} // Silver color for tab text
//         >
//           <Tab label="Sign In" sx={{ color: 'white' }}/>
//           <Tab label="Sign Up" sx={{ color: 'white' }}/>
//         </Tabs>
//         <Box sx={{ mt: 2 }}>
//           <GoogleAuth />
//         </Box>
//         <Box sx={{ mt: 2 }}>
//           {tabValue === 0 && <SignIn />}
//           {tabValue === 1 && <SignUp />}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
'use client'
import { useState } from 'react';
import GoogleAuth from '../components/GoogleAuth';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import { Box, Tabs, Tab, Typography } from '@mui/material';

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          margin: 'auto',
          backgroundColor: 'black',
          borderRadius: 2,
          color: 'white',
          padding: 3,
          boxShadow: 3,
        }}
      >
                <Typography variant="h3" component="h3" align="center" gutterBottom>
          Welcome to Pantry Pal AI
        </Typography>
        <Typography variant="h4" component="h3" align="center">
          All in one pantry tracker
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ 
            mb: 3,
            '& .MuiTab-root': { color: 'white' },
            '& .Mui-selected': { color: 'white' },
            '& .MuiTabs-indicator': { backgroundColor: 'white' }
          }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <GoogleAuth />
        </Box>
        <Box sx={{ mt: 4 }}>
          {tabValue === 0 && <SignIn />}
          {tabValue === 1 && <SignUp />}
        </Box>
      </Box>
    </Box>
  );
}