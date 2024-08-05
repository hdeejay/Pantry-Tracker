// 'use client'

// import { useState } from 'react';
// import { doSignInWithEmailAndPassword } from '../auth';
// import { useRouter } from 'next/navigation';

// export default function SignIn() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const router = useRouter();

//     const handleSignIn = async (e) => {
//         e.preventDefault();
//         try {
//             await doSignInWithEmailAndPassword(email, password);
//             router.push('/'); // Redirect to home page after sign in
//         } catch (error) {
//             console.error("Error signing in:", error);
//             // Handle error (e.g., show error message to user)
//         }
//     };

//     return (
//         <form onSubmit={handleSignIn}>
//             <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 required
//             />
//             <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//             />
//             <button type="submit" style={{ color: 'white', backgroundColor: 'transparent', border: '1px solid white' }}>Sign In</button>
//         </form>
//     );

// return (
//     <Box sx={{ color: 'white' }}>
//       <form onSubmit={handleSignIn}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">Sign In</button>
//       </form>
//     </Box>
//   );
'use client'
import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../auth';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await doSignInWithEmailAndPassword(email, password);
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1, width: '100%' }}>
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
            autoComplete="current-password"
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
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}