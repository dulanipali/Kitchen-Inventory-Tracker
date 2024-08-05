'use client'

import { firestore } from "@/firebase";
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from "@mui/material";
import { getDoc } from "firebase/firestore";
import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPantry, setFilteredPantry] = useState([]);
  const itemRefs = useRef({});

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry();
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = pantry.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPantry(filtered);
    } else {
      setFilteredPantry(pantry);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add items to the pantry
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display="flex" flexDirection="row" gap={3}>
        <Button variant="contained" onClick={handleOpen}
          sx={{
            bgcolor: "#4A3728",
            color: "white",
          }}>
          Add Items
        </Button>
        <Button variant="contained" sx={{
          bgcolor: "#4A3728",
          color: "white",
        }}>
          Get Recipes
        </Button>
      </Box>

      <Box
        width="80%"
        borderRadius={1}
        bgcolor="white"
        boxShadow={3}
        p={3}
        mt={3}
      >
        <Box
          bgcolor="#4A3728"
          color="white"
          p={2}
          borderRadius={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Kitchen Inventory</Typography>
        </Box>
        <TextField
          id="filled-search"
          label="Search items"
          type="search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          fullWidth
          margin="normal"
        />
        <Stack spacing={2} overflow="auto" height="300px">
          {filteredPantry.map(({ name, count }) => (
            <Box
              key={name}
              ref={(el) => (itemRefs.current[name] = el)}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              borderRadius={1}
              p={2}
              boxShadow={1}
            >
              <Typography variant="h6">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6">
                Quantity: {count}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => addItem(name)}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => removeItem(name)}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
