export const globalStyles = {
  // Reusable component styles
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: 'background.default',
    pb: 8, // Padding bottom for BottomNav
  },
  
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: { xs: 2, sm: 3, md: 4 },
  },
  
  card: {
    p: { xs: 2, sm: 3 },
    mb: 2,
    borderRadius: 2,
  },
  
  savingsTag: {
    backgroundColor: 'success.main',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  
  priceText: {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: 'primary.main',
  },
  
  iconButton: {
    color: 'primary.main',
    '&:hover': {
      backgroundColor: 'primary.light',
      color: 'white',
    },
  },
};