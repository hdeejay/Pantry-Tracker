'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  Modal, 
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ClearIcon from '@mui/icons-material/Clear'
import { firestore, auth } from './firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { useAuth } from './contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { signOut } from './auth'
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Camera } from "react-camera-pro";
import OpenAI from "openai";



// import OpenAI from "openai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
const openai = new OpenAI({
apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
dangerouslyAllowBrowser: true // Only for development. Use server-side calls in production.
});

const drawerWidth = 240;

const filterInventory = (items, term) => {
  return items.filter(item => 
    item.name.toLowerCase().includes(term.toLowerCase())
  );
};

const generateRecipe = async (ingredients) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}. Start with the recipe title on the first line.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
};

const analyzeImage = async (imageBase64) => {
  try {
    console.log("Sending request to OpenAI Vision API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What item is in this image? Please respond with just the name of the item." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail:"low"
              }
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return null;
  }
};



export default function Home() {
  const { currentUser, userLoggedIn, loading } = useAuth()
  const router = useRouter()
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [identifiedItemName, setIdentifiedItemName] = useState('')
  const [activeTab, setActiveTab] = useState('Pantry')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false)
  const [itemImage, setItemImage] = useState(null)
  const camera = useRef(null);

  useEffect(() => {
    if (!loading && !userLoggedIn) {
      router.push('/auth-page')
    } else if (userLoggedIn) {
      updateInventory()
    }
  }, [loading, userLoggedIn, router])

  const fetchPexelsImage = async (query) => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
        }
      });
      if (response.data && response.data.photos && response.data.photos.length > 0) {
        return response.data.photos[0].src.medium;
      }
      console.log("No images found for query:", query);
      return null;
    } catch (error) {
      console.error("Error fetching image from Pexels:", error);
      return null;
    }
  };



  const updateInventory = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const inventoryRef = collection(userRef, 'inventory');
    const snapshot = await getDocs(inventoryRef);
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  }

  const addItem = async (item, identifiedName) => {
    if (!auth.currentUser) return;
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const inventoryRef = collection(userRef, 'inventory');
    const itemRef = doc(inventoryRef, item);
    const docSnap = await getDoc(itemRef);
    
    let imageUrl = itemImage;
    if (!imageUrl) {
      imageUrl = await fetchPexelsImage(item);
    }
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(itemRef, { 
        quantity: quantity + 1, 
        imageUrl, 
        identifiedName: identifiedName || item 
      }, { merge: true });
    } else {
      await setDoc(itemRef, { 
        quantity: 1, 
        imageUrl, 
        identifiedName: identifiedName || item 
      });
    }
    
    await updateInventory();
  }


  const removeItem = async (item) => {
    if (!auth.currentUser) return;
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const inventoryRef = collection(userRef, 'inventory');
    const itemRef = doc(inventoryRef, item);
    const docSnap = await getDoc(itemRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(itemRef);
      } else {
        await setDoc(itemRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemImage(null);
    setItemName('');
    setIdentifiedItemName('');
  };

  const handleCameraOpen = () => setCameraOpen(true);
  const handleCameraClose = () => setCameraOpen(false);

  const takePhoto = async () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setItemImage(photo);
      
      // Convert the photo to base64
      const base64Image = photo.split(',')[1];
      
      // Analyze the image
      const identifiedName = await analyzeImage(base64Image);
      if (identifiedName) {
        setItemName(identifiedName); // Set this as the default item name
        setIdentifiedItemName(identifiedName);
      }
      
      handleCameraClose();
    }
  };


  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth-page')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleGenerateRecipe = async () => {
    setGenerating(true);
    const ingredients = inventory.map(item => item.name);
    if (ingredients.length === 0) {
      setRecipe('Please add some ingredients to your inventory first.');
      setGenerating(false);
      return;
    }
    try {
      const generatedRecipe = await generateRecipe(ingredients);
      if (generatedRecipe) {
        setRecipe(generatedRecipe);
      } else {
        setRecipe('Failed to generate recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipe('An error occurred while generating the recipe. Please try again.');
    }
    setGenerating(false);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {['Pantry', 'Inventory', 'Recipes'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => setActiveTab(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Pantry':
        return (
          <>
            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Add New Item
            </Button>
            <Stack width="100%" spacing={2}>
              {inventory.map(({ name, quantity, imageUrl, identifiedName }) => (
                <Box
                  key={name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#f0f0f0',
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {imageUrl && (
                    <Box sx={{ width: 100, height: 100, mr: 2, overflow: 'hidden' }}>
                      <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                    {identifiedName && identifiedName !== name && (
                      <Typography variant="body2" color="text.secondary">
                        AI identified as: {identifiedName}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body1">Quantity: {quantity}</Typography>
                  <Box>
                    <Button variant="contained" onClick={() => addItem(name, identifiedName)} sx={{ mr: 1 }}>
                      Add
                    </Button>
                    <Button variant="contained" onClick={() => removeItem(name)}>
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </>
        );
      case 'Inventory':
        const filteredInventory = filterInventory(inventory, searchTerm);
        return (
          <>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setSearchTerm('')}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {filteredInventory.length > 0 ? (
              <Stack width="100%" spacing={2}>
                {filteredInventory.map(({ name, quantity, imageUrl, identifiedName }) => (
                  <Box
                    key={name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: '#f0f0f0',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {imageUrl && (
                      <Box sx={{ width: 100, height: 100, mr: 2, overflow: 'hidden' }}>
                        <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    )}
                    <Box>
                      <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                      {identifiedName && identifiedName !== name && (
                        <Typography variant="body2" color="text.secondary">
                          AI identified as: {identifiedName}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1">Quantity: {quantity}</Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography>No items match your search.</Typography>
            )}
          </>
        );
      case 'Recipes':
        return (
          <>
            <Button
              variant="contained"
              onClick={handleGenerateRecipe}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Recipe'}
            </Button>
            {recipe && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {recipe}
                </Typography>
              </Box>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!userLoggedIn) {
    return null // This will be handled by the useEffect redirect
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {currentUser.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 2 }}>{activeTab}</Typography>
        {renderContent()}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder="Enter item name"
            type="text"
            fullWidth
            variant="standard"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button onClick={handleCameraOpen}>Take Photo</Button>
          {itemImage && <img src={itemImage} alt="Item" style={{ width: '100%', marginTop: 10 }} />}
          {identifiedItemName && identifiedItemName !== itemName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              AI identified as: {identifiedItemName}
            </Typography>
          )}
          <Button onClick={() => {
            addItem(itemName, identifiedItemName || itemName);
            setItemName('');
            setIdentifiedItemName('');
            setItemImage(null);
            handleClose();
          }}>Add</Button>
        </Box>
      </Modal>
      <Modal
        open={cameraOpen}
        onClose={handleCameraClose}
        aria-labelledby="camera-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="camera-modal-title" variant="h6" component="h2">
            Take Photo
          </Typography>
          <Camera ref={camera} />
          <Button onClick={takePhoto}>Capture</Button>
        </Box>
      </Modal>
    </Box>
  )
}