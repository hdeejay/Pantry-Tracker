// 'use client'

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { doCreateUserWithEmailAndPassword } from '../auth';
// import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

// export default function SignUp() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         if (password !== confirmPassword) {
//             setError("Passwords don't match");
//             return;
//         }

//         try {
//             await doCreateUserWithEmailAndPassword(email, password);
//             router.push('/'); // Redirect to home page after successful sign up
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs">
//             <Box
//                 sx={{
//                     marginTop: 8,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                 }}
//             >
//                 <Typography component="h1" variant="h5">
//                     Sign Up
//                 </Typography>
//                 <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//                     {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="email"
//                         label="Email Address"
//                         name="email"
//                         autoComplete="email"
//                         autoFocus
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         type="password"
//                         id="password"
//                         autoComplete="new-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="confirmPassword"
//                         label="Confirm Password"
//                         type="password"
//                         id="confirmPassword"
//                         autoComplete="new-password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                    <Button
//     type="submit"
//     fullWidth
//     variant="contained"
//     sx={{ color: 'white', backgroundColor: 'transparent', border: '1px solid white', mt: 3, mb: 2 }}
// >
//     Sign Up
// </Button>
//                 </Box>
//             </Box>
//         </Container>
//     );
// }
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCreateUserWithEmailAndPassword } from '../auth';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, color: 'white' }}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ 
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ 
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              mt: 3, 
              mb: 2 
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}