import React from 'react';
import { Box, Card, CardContent, Skeleton as MUISkeleton } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Card skeleton for product/campaign cards
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <Box>
      {Array(count).fill(0).map((_, index) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Skeleton height={24} width="60%" style={{ marginBottom: 10 }} />
            <Skeleton height={16} count={2} style={{ marginBottom: 8 }} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Skeleton height={40} width={100} />
              <Skeleton height={40} width={100} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// List skeleton for leaderboard items
export const ListSkeleton = ({ count = 5 }) => {
  return (
    <Box>
      {Array(count).fill(0).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            mb: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <MUISkeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton height={20} width="70%" />
            <Skeleton height={16} width="40%" />
          </Box>
          <Skeleton height={24} width={60} />
        </Box>
      ))}
    </Box>
  );
};

// Profile skeleton
export const ProfileSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MUISkeleton variant="circular" width={90} height={90} sx={{ mb: 2 }} />
        <Skeleton height={32} width={200} style={{ marginBottom: 8 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={60} />
        </Box>
      </Box>

      {/* Grid Skeleton */}
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, height: '100%' }}>
          {Array(4).fill(0).map((_, index) => (
            <Card key={index} sx={{ p: 2, borderRadius: 3, height: '100%', minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MUISkeleton variant="circular" width={36} height={36} />
                <Skeleton height={20} width="60%" />
              </Box>
              <Box sx={{ mt: 'auto' }}>
                <Skeleton height={36} width="80%" />
                <Skeleton height={16} width="40%" style={{ marginTop: 8 }} />
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};