import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  Card,
  Button,
  IconButton,
  Chip,
  Collapse,
  useTheme,
  alpha,
  Divider,
  keyframes,
  MenuItem
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faSearch,
  faCartPlus,
  faTrash,
  faMapMarkerAlt,
  faRoute,
  faChevronUp,
  faReceipt,
  faHandsPraying,
  faStore,
  faShoppingBasket,
  faTimes,
  faCheck,
  faSortAmountDown
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import { globalStyles } from '../theme/globalStyles';

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  { id: 1, name: 'Asahi Super Dry 350ml', nameJa: 'アサヒ スーパードライ 350ml' },
  { id: 2, name: 'Nissin Cup Noodle', nameJa: '日清 カップヌードル' },
  { id: 3, name: 'Meiji Oishii Gyunyu 900ml', nameJa: '明治 おいしい牛乳 900ml' },
  { id: 4, name: 'Calbee Potato Chips', nameJa: 'カルビー ポテトチップス' },
  { id: 5, name: 'Pasco Shokupan 6 slices', nameJa: 'Pasco 超熟 6枚切' },
  { id: 6, name: '-196 Strong Zero Lemon', nameJa: '-196 ストロングゼロ レモン' },
  { id: 7, name: 'Oshikiri Tofu 300g', nameJa: 'オシキリ もめん豆腐 300g' },
  { id: 8, name: 'Fresh Eggs (10 pack)', nameJa: '新鮮卵 (10個入)' },
];

const MOCK_STORES = [
  { id: 1, name: 'Seicomart Odori', distance: 150, unit: 'm', lat: 43.0611, lng: 141.3564 },
  { id: 2, name: 'Seven Eleven Sapporo Stn.', distance: 450, unit: 'm', lat: 43.0686, lng: 141.3508 },
  { id: 3, name: 'MaxValu Kita 1-Jo', distance: 1.2, unit: 'km', lat: 43.0625, lng: 141.3346 },
  { id: 4, name: 'Lawson Susukino', distance: 800, unit: 'm', lat: 43.055, lng: 141.353 },
  { id: 5, name: 'Coop Sapporo', distance: 2.1, unit: 'km', lat: 43.07, lng: 141.36 },
];

const PLACEHOLDERS = [
  "Milk", "Eggs", "Bread", "Beer", "Natto", "Tofu"
];

const Compare = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isEnglish = i18n.language.startsWith('en');

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedStoreId, setExpandedStoreId] = useState(null);
  const [lastComparedCart, setLastComparedCart] = useState([]); 
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('savings'); 

  // Typing Animation State
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Navigation Dialog State
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // --- Geolocation (Run on mount) ---
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(loc);
        console.log("High precision location acquired:", loc);
      },
      (error) => {
        console.warn("Location error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // --- Typing Animation Logic ---
  useEffect(() => {
    const currentWord = PLACEHOLDERS[placeholderIndex];
    let timeout;

    if (charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 150); 
    } else {
      timeout = setTimeout(() => {
        setPlaceholder('');
        setCharIndex(0);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }, 2000); 
    }

    return () => clearTimeout(timeout);
  }, [charIndex, placeholderIndex]);

  // --- Search Logic ---
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const term = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.nameJa && p.nameJa.includes(term))
    );
  });

  const toggleCartItem = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
        handleRemoveFromCart(product.id);
    } else {
        setCart([...cart, product]);
        setSearchQuery(''); 
    }
  };

  const handleRemoveFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    if (newCart.length === 0) {
        setResults(null);
    }
  };

  // Re-sort results when sort option changes
  useEffect(() => {
    if (results && results.length > 0) {
        const sorted = [...results].sort((a, b) => {
            if (sortBy === 'savings') {
                return b.savings - a.savings; 
            } else if (sortBy === 'distance') {
                const distA = a.unit === 'km' ? a.distance * 1000 : a.distance;
                const distB = b.unit === 'km' ? b.distance * 1000 : b.distance;
                return distA - distB; 
            }
            return 0;
        });
        setResults(sorted);
    }
  }, [sortBy]);

  const isCartDirty = JSON.stringify(cart) !== JSON.stringify(lastComparedCart);
  const canCompare = cart.length > 0 && (results === null || isCartDirty);

  const handleCompare = () => {
    if (!canCompare) return;

    setLoading(true);
    
    setTimeout(() => {
      const calculatedResults = MOCK_STORES.map(store => {
        let availableCount = 0;
        let totalPrice = 0;
        let totalAvgPrice = 0;
        const productsDetails = [];

        cart.forEach(item => {
            const isAvailable = Math.random() > 0.2; 
            const mockAvgPrice = 150 + Math.random() * 200; 

            if (isAvailable) {
                availableCount++;
                const variance = 0.85 + Math.random() * 0.3; 
                const price = Math.floor(mockAvgPrice * variance);
                totalPrice += price;
                totalAvgPrice += mockAvgPrice;
                productsDetails.push({ ...item, price, isAvailable: true });
            } else {
                productsDetails.push({ ...item, price: 0, isAvailable: false });
            }
        });

        const savings = Math.max(0, totalAvgPrice - totalPrice);

        return {
            ...store,
            availableCount,
            totalCartSize: cart.length,
            totalPrice,
            savings,
            productsDetails
        };
      });

      // Initial Sort based on state
      calculatedResults.sort((a, b) => b.savings - a.savings);
      
      setResults(calculatedResults);
      setLastComparedCart([...cart]);
      setLoading(false);
      
      setTimeout(() => {
          document.getElementById('compare-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1200);
  };

  const handleNavigateClick = (store) => {
    setSelectedStore(store);
    setNavDialogOpen(true);
  };

  const confirmNavigation = () => {
    if (selectedStore) {
        const url = `https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`;
        window.open(url, '_blank');
        setNavDialogOpen(false);
    }
  };

  const toggleExpand = (storeId) => {
    setExpandedStoreId(expandedStoreId === storeId ? null : storeId);
  };

  // Helper to determine maximum savings
  const maxSavings = results ? Math.max(...results.map(s => s.savings)) : 0;

  // --- Dialog Styles ---
  const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9998, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease-out',
  };
  const contentStyle = {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '90vw', maxWidth: '400px', maxHeight: '85vh', zIndex: 9999,
    backgroundColor: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease-out',
    overflowY: 'auto'
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 12 }}>
    
    {/* Title Section */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5, textAlign: 'center' }}>
        <Box sx={{ 
            width: { xs: 40, sm: 50 }, 
            height: { xs: 40, sm: 50 }, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.secondary.main, 0.1), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mr: 2 
        }}>
            <FontAwesomeIcon icon={faShoppingCart} style={{ color: theme.palette.secondary.main }} size="lg" />
        </Box>
        <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {t('compare.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {t('compare.subtitle')}
            </Typography>
        </Box>
    </Box>

    {/* Search & Cart Container */}
    <Paper 
        elevation={0}
        sx={{ 
        p: { xs: 3, md: 4 }, 
        mb: 4, 
        borderRadius: 4, 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderLeft: `6px solid ${theme.palette.secondary.main}`,
        position: 'relative',
        overflow: 'hidden'
        }}
    >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, transform: 'rotate(15deg)' }}>
            <FontAwesomeIcon icon={faShoppingBasket} size="10x" />
        </Box>

        {/* Search Bar */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
            <TextField
                fullWidth
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FontAwesomeIcon icon={faSearch} color={theme.palette.text.secondary} />
                        </InputAdornment>
                    ),
                    sx: { 
                        borderRadius: 3, 
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        '& fieldset': { border: 'none' } 
                    }
                }}
            />
        </Box>

        {/* Search Items */}
        {searchQuery && (
            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={1}>
                    {filteredProducts.slice(0, 4).map((product) => {
                        const inCart = cart.some(i => i.id === product.id);
                        return (
                            <Grid key={product.id}>
                                <Card 
                                    elevation={0}
                                    onClick={() => toggleCartItem(product)}
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        p: 1.5,
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        cursor: 'pointer',
                                        border: inCart 
                                            ? `2px solid ${theme.palette.success.main}` 
                                            : '1px solid transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ pl: 1 }}>
                                        {isEnglish ? product.name : product.nameJa}
                                    </Typography>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        )}

        {/* Cart Display */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                    {t('compare.cartTitle')}
                </Typography>
                
                {cart.length > 0 && (
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                        <FontAwesomeIcon icon={faShoppingBasket} color={theme.palette.primary.main} size="lg" />
                        <Box sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            minWidth: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid white',
                            px: 0.5
                        }}>
                            {cart.length}
                        </Box>
                    </Box>
                )}
            </Box>
            
            {cart.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.background.paper, 0.6), borderRadius: 2, color: 'text.secondary' }}>
                    <Typography variant="body2">{t('compare.cartEmpty')}</Typography>
                </Box>
            ) : (
                <Grid container spacing={1}>
                    {cart.map((item) => (
                        <Grid key={item.id}>
                            <Card
                                elevation={0}
                                onClick={() => handleRemoveFromCart(item.id)}
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: 'white',
                                    cursor: 'pointer',
                                    // Red Border for Cart Items
                                    border: `1px solid ${theme.palette.error.main}`,
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        bgcolor: alpha(theme.palette.error.main, 0.05),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {/* UPDATED: Matches search items style (no wrap, full width) */}
                                <Typography variant="subtitle2" fontWeight={700} sx={{ pl: 1 }}>
                                    {isEnglish ? item.name : item.nameJa}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={handleCompare}
                disabled={!canCompare || loading}
                sx={{ mt: 3, borderRadius: 50, py: 1.5, fontWeight: 700, fontSize: '1.1rem', boxShadow: 4 }}
            >
                {loading ? t('compare.calculating') : t('compare.findBestPrice')}
            </Button>
        </Box>
    </Paper>

    {/* Results Section */}
    {results && (
        <Box id="compare-results" sx={{ animation: 'fadeInUp 0.5s ease-out' }}>
            
            {/* Header with Title and Sorting */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
                    <Box sx={{ 
                        width: { xs: 40, sm: 50 }, 
                        height: { xs: 40, sm: 50 }, 
                        borderRadius: '50%', 
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1), 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}>
                        <FontAwesomeIcon icon={faStore} style={{ color: theme.palette.secondary.main }} size="lg" />
                    </Box>
                    <Typography variant="h5" fontWeight={700}>
                        {t('compare.resultsTitle')}
                    </Typography>
                </Box>

                <TextField
                    select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSortAmountDown} size="xs" />
                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{ minWidth: 160, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                    <MenuItem value="savings">{t('compare.sortSavings')}</MenuItem>
                    <MenuItem value="distance">{t('compare.sortDistance')}</MenuItem>
                </TextField>
            </Box>

            {/* Results Container */}
            <Paper 
                variant="outlined" 
                sx={{ 
                    bgcolor: '#fafafa',
                    borderRadius: 3,
                    p: 2
                }}
                >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {results.map((store, index) => {
                        // UPDATED: Logic for red border (Highest Savings visible in both sorts)
                        const isHighestSavings = store.savings === maxSavings && maxSavings > 0;
                        const isExpanded = expandedStoreId === store.id;

                        // Border Color Logic
                        let borderColor = '1px solid transparent';
                        if (isExpanded) {
                            borderColor = `2px solid ${theme.palette.primary.main}`;
                        } else if (isHighestSavings) {
                            borderColor = `2px solid #27AE60`;
                        }

                        return (
                            <Paper 
                                key={store.id} 
                                elevation={isExpanded ? 4 : (isHighestSavings ? 3 : 1)}
                                sx={{ 
                                    borderRadius: 3, 
                                    border: borderColor,
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    transform: isExpanded ? 'scale(1.01)' : 'scale(1)',
                                    '&:hover': { transform: isExpanded ? 'scale(1.01)' : 'translateY(-2px)' }
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        display: 'flex',
                                        flexDirection: {xs: 'column', sm: 'row'},
                                        alignItems: { xs: 'stretch', md: 'center' },
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        bgcolor: isExpanded 
                                            ? alpha(theme.palette.primary.main, 0.05) 
                                            : (isHighestSavings ? alpha(theme.palette.secondary.main, 0.02) : 'white')
                                    }}
                                    onClick={() => toggleExpand(store.id)}
                                >
                                    {/* Store Info */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: '60%' }, minWidth: { sm: '60%' } }}>
                                        <Box sx={{ 
                                            width: 44, height: 44, borderRadius: '12px', 
                                            bgcolor: theme.palette.grey[100], 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <FontAwesomeIcon icon={faStore} color={theme.palette.primary.main} size="lg" />
                                        </Box>
                                        <Box display='flex' alignItems='center' justifyContent='space-between' sx={{ gap: {xs: 1, sm: 2} }} width='100%' >
                                            <Box>
                                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: { xs: '1.15rem', sm: '1.25rem' } }}>
                                                    {store.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                    {store.distance}{store.unit}
                                                </Typography>
                                            </Box>
                                            {store.savings > 0 && (
                                                <Chip 
                                                    label={t('compare.savings', { amount: store.savings.toLocaleString() })}
                                                    size="small"
                                                    color="success"
                                                    sx={{ fontWeight: 800, height: 28, color: '#ffffff' }} 
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Savings & Action */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: { xs: 'space-evenly', sm: 'flex-end' },
                                        gap: 2
                                    }}>
                                            <Chip 
                                                label={t('compare.productsAvailable', { available: store.availableCount, total: store.totalCartSize })} 
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }} 
                                            />
                                        
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigateClick(store);
                                            }}
                                            startIcon={<FontAwesomeIcon icon={faRoute} />}
                                            sx={{ borderRadius: 2, fontSize: { xs: '0.85rem', sm: '1rem' } }}
                                        >
                                            {t('compare.navigate')}
                                        </Button>
                                    </Box>
                                </Box>

                                {/* Expanded Details */}
                                <Collapse in={isExpanded}>
                                    <Divider />
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                        {store.productsDetails.map((product) => (
                                            <Box 
                                                key={product.id} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    py: 1, 
                                                    borderBottom: '1px dashed #e0e0e0',
                                                    '&:last-child': { borderBottom: 'none' },
                                                    opacity: product.isAvailable ? 1 : 0.5
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {isEnglish ? product.name : product.nameJa}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {product.isAvailable ? `¥${product.price}` : '-'}
                                                </Typography>
                                            </Box>
                                        ))}
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                            <IconButton size="small" onClick={() => toggleExpand(store.id)}>
                                                <FontAwesomeIcon icon={faChevronUp} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </Paper>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    )}

    {/* Navigation Reminder Dialog */}
    <Dialog.Root open={navDialogOpen} onOpenChange={setNavDialogOpen}>
        <Dialog.Portal>
            <Dialog.Overlay style={overlayStyle} />
            <Dialog.Content style={contentStyle}>
                <Box sx={{ position: 'relative' }}>
                        <Dialog.Title asChild>
                        <Box sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography variant="h5" fontWeight={800}>
                                {t('compare.reminderTitle')}
                            </Typography>
                        </Box>
                        </Dialog.Title>
                        
                        <Dialog.Description asChild>
                            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, lineHeight: 1.5 }}>
                            {t('compare.reminderBody')}
                            </Typography>
                        </Dialog.Description>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button 
                            onClick={() => setNavDialogOpen(false)} 
                            color="inherit"
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={confirmNavigation}
                            startIcon={<FontAwesomeIcon icon={faRoute} />}
                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}
                            >
                                {t('compare.goToMaps')}
                            </Button>
                        </Box>
                </Box>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>

    <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }`}</style>
    </Container>
  );
};

export default Compare;