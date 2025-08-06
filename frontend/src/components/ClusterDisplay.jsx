import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper for safe number rendering
function safeFixed(val, places = 2, fallback = 'N/A') {
  return (typeof val === "number" && isFinite(val)) ? val.toFixed(places) : fallback;
}

// Converts gender ratio (0.11) to percent string "11.00"
function safePercent(val, places = 2, fallback = 'N/A') {
  return (typeof val === "number" && isFinite(val)) ? (val * 100).toFixed(places) : fallback;
}

function ClusterDisplay({ clusters }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          textAlign: 'center',
          color: '#FFF',
          textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
          fontSize: { xs: '1.25rem', sm: '1.75rem' },
        }}
      >
        User Clusters
      </Typography>
      {(!clusters || clusters.length === 0) ? (
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
          Loading cluster data...
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {clusters.map((cluster, index) => (
            <Grid item xs={12} sm={6} md={4} key={cluster.cluster ?? index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Cluster {cluster.cluster ?? 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 1 }}>
                      Users: {cluster.num_users ?? 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 1 }}>
                      Avg. Age: {safeFixed(cluster.age_mean)} (Std: {safeFixed(cluster.age_std)})
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 1 }}>
                      Gender: M ({safePercent(cluster.gender_dist?.M) ?? 'N/A'}%), F ({safePercent(cluster.gender_dist?.F) ?? 'N/A'}%)
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 2 }}>
                      Top Occupations: {cluster.top_occupations && Object.keys(cluster.top_occupations).length > 0
                        ? Object.entries(cluster.top_occupations)
                            .map(([occ, prob]) => `${occ} (${safePercent(prob, 1)}%)`)
                            .join(', ')
                        : "N/A"}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 1, fontWeight: 500 }}>
                      Genre Preferences:
                    </Typography>
                    {Array.isArray(cluster.genre_preferences) && cluster.genre_preferences.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={cluster.genre_preferences} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: '#FFF', fontSize: 12 }}
                            angle={45}
                            textAnchor="end"
                            interval={0}
                          />
                          <YAxis tick={{ fill: '#FFF', fontSize: 12 }} domain={[0, 5]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#FFF',
                            }}
                          />
                          <Bar dataKey="value" fill="#FF6F61" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', mb: 1 }}>
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
