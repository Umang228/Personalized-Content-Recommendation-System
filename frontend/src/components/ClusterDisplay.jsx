import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Returns formatted number or 0 if NaN/null/undefined
function safeFixed(val, places = 2) {
  return typeof val === 'number' && isFinite(val) ? val.toFixed(places) : '0';
}

// Returns percentage string or "0" if NaN/null/undefined
function safePercent(val, places = 2) {
  if (typeof val === 'number' && isFinite(val)) {
    return (val * 100).toFixed(places);
  }
  return '0';
}

function ClusterDisplay({ clusters }) {
  return (
    <Box sx={{ mt: 4 }}>

      {!clusters || clusters.length === 0 ? (
        <Typography
          sx={{
            color: '#777',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.2rem' }
          }}
        >
          Loading cluster data...
        </Typography>
      ) : (
        <Grid container spacing={3} direction="column">
          {clusters.map((cluster, index) => (
            <Grid
              item
              xs={12}
              key={cluster.cluster ?? index}
              sx={{
                display: 'block',
                width: '100%',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(94,96,206,0.08)',
                    color: '#222',
                    p: 2,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: '#7209b7' }}
                    >
                      Cluster {(typeof cluster.cluster === 'number' ? cluster.cluster + 1 : 'N/A')}
                    </Typography>

                    <Typography sx={{ fontSize: '0.95rem', mb: 1 }}>
                      <strong>Users:</strong> {cluster.num_users ?? '0'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', mb: 1 }}>
                      <strong>Avg. Age:</strong> {safeFixed(cluster.age_mean)} (Std: {safeFixed(cluster.age_std)})
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', mb: 1 }}>
                      <strong>Gender:</strong> M ({safePercent(cluster.gender_dist?.M)}%), F ({safePercent(cluster.gender_dist?.F)}%)
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', mb: 2 }}>
                      <strong>Top Occupations:</strong>{' '}
                      {cluster.top_occupations && Object.keys(cluster.top_occupations).length > 0
                        ? Object.entries(cluster.top_occupations)
                            .map(
                              ([occ, prob]) => `${occ} (${safePercent(prob, 1)}%)`
                            )
                            .join(', ')
                        : '0%'}
                    </Typography>

                    <Typography sx={{ fontSize: '1rem', mb: 1, fontWeight: 600, color: '#5e60ce' }}>
                      Genre Preferences
                    </Typography>

                    {Array.isArray(cluster.genre_preferences) && cluster.genre_preferences.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                          data={cluster.genre_preferences}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: '#5e60ce', fontSize: 12, fontWeight: '600' }}
                            angle={45}
                            textAnchor="end"
                            interval={0}
                          />
                          <YAxis
                            tick={{ fill: '#5e60ce', fontSize: 12, fontWeight: '600' }}
                            domain={[0, 5]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #ddd',
                              borderRadius: 8,
                              color: '#222',
                              fontWeight: '600',
                            }}
                          />
                          <Bar dataKey="value" fill="#f72585" barSize={18} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography sx={{ color: '#999', fontSize: '0.95rem' }}>
                        No genre data available.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ClusterDisplay;
