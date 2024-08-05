// 'use client'
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signInWithGoogle } from '../auth';
// import { Button } from '@mui/material';

// export default function GoogleAuth() {
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleGoogleSignIn = async () => {
//     try {
//       await signInWithGoogle();
//       router.push('/'); // Redirect to home page after successful sign-in
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div>
//       <Button variant="contained" onClick={handleGoogleSignIn} sx={{ color: 'white', backgroundColor: 'transparent', border: '1px solid white' }}>
//         Sign in with Google
//       </Button>
//       {error && <p style={{color: 'white'}}>{error}</p>}
//     </div>
//   );
// }
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '../auth';
import { Button, Box, Typography } from '@mui/material';

export default function GoogleAuth() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Button 
        variant="outlined" 
        onClick={handleGoogleSignIn} 
        sx={{ 
          color: 'white', 
          borderColor: 'white',
          '&:hover': {
            borderColor: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          },
          width: '100%',
          maxWidth: 300,
          mb: 2
        }}
      >
        Sign in with Google
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}