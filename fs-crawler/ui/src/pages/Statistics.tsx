import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  CardHeader,
  Avatar,
  Skeleton,
  Chip,
} from '@mui/material'
import {
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  ContentCopy as DuplicateIcon,
  Category as CategoryIcon,
  ShowChart as ChartIcon,
  InsertChart as ChartBarIcon,
  Equalizer as EqualizerIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useFileStats, useDuplicateStats } from '@/hooks/useApi'

// Define a consistent color palette
const COLORS = ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#8bc34a', '#ffeb3b', '#795548', '#607d8b']

const Statistics: React.FC = () => {
  const { data: fileStats, isLoading: fileStatsLoading, error: fileStatsError } = useFileStats()
  const { data: duplicateStats, isLoading: duplicateStatsLoading, error: duplicateStatsError } = useDuplicateStats()

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Prepare chart data
  const categoryChartData = fileStats?.by_category.map((category, index) => ({
    name: category._id || 'Unknown',
    value: category.count,
    size: category.total_size,
    color: COLORS[index % COLORS.length]
  })) || []

  const duplicateChartData = duplicateStats ? [
    { name: 'Unique Files', value: (fileStats?.total_files || 0) - duplicateStats.duplicate_files, color: COLORS[1] },
    { name: 'Duplicate Files', value: duplicateStats.duplicate_files, color: COLORS[3] },
    { name: 'Deletion Candidates', value: duplicateStats.deletion_candidates, color: COLORS[2] },
  ] : []

  if (fileStatsError || duplicateStatsError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Failed to load statistics. Please check your connection and try again.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Statistics
        </Typography>
        <Chip
          label="Real-time Data"
          color="primary"
          variant="outlined"
          size="small"
          sx={{ borderRadius: 12, height: 20, fontSize: '0.7rem' }}
        />
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <StorageIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Total Files
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={16} width="80%" sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" height={14} width="70%" sx={{ mt: 0.5 }} />
                </Box>
              ) : fileStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {formatNumber(fileStats.total_files)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Indexed Files
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {formatNumber(fileStats.total_directories)} directories
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <CategoryIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Categories
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={16} width="80%" sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" height={14} width="70%" sx={{ mt: 0.5 }} />
                </Box>
              ) : fileStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" color="secondary" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {fileStats.by_category.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    File Types
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    {fileStats.by_category.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Largest: {fileStats.by_category[0]._id} ({formatNumber(fileStats.by_category[0].count)})
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                  <DuplicateIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Duplicates
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {duplicateStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={16} width="80%" sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" height={14} width="70%" sx={{ mt: 0.5 }} />
                </Box>
              ) : duplicateStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" color="warning" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {formatNumber(duplicateStats.duplicate_groups)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Duplicate Groups
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {formatNumber(duplicateStats.duplicate_files)} total duplicates
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                  <AnalyticsIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Storage
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={16} width="80%" sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" height={14} width="70%" sx={{ mt: 0.5 }} />
                </Box>
              ) : fileStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" color="info" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {formatBytes(fileStats.by_category.reduce((sum, cat) => sum + cat.total_size, 0))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Total Size
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Across {fileStats.by_category.length} categories
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2}>
        {/* File Categories Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <PieChartIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Files by Category
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, height: 350 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatNumber(value as number), 'Files']}
                      contentStyle={{ borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                    No data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* File Categories Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <ChartBarIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  File Count by Category
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, height: 350 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(value) => [formatNumber(value as number), 'Files']}
                      contentStyle={{ borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                    No data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Duplicate Analysis */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                  <EqualizerIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Duplicate Analysis
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, height: 350 }}>
              {duplicateStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Skeleton variant="text" height={16} width="100%" />
                    <Skeleton variant="text" height={16} width="90%" />
                    <Skeleton variant="text" height={16} width="80%" />
                    <Skeleton variant="text" height={16} width="70%" />
                  </Box>
                  <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                  </Box>
                </Box>
              ) : duplicateStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Duplicate Groups:</span>
                      <strong>{formatNumber(duplicateStats.duplicate_groups)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Total Duplicate Files:</span>
                      <strong>{formatNumber(duplicateStats.duplicate_files)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Deletion Candidates:</span>
                      <strong>{formatNumber(duplicateStats.deletion_candidates)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Best Quality Marked:</span>
                      <strong>{formatNumber(duplicateStats.best_quality_files)}</strong>
                    </Typography>
                  </Box>

                  {duplicateChartData.length > 0 && (
                    <ResponsiveContainer width="100%" height="70%">
                      <PieChart>
                        <Pie
                          data={duplicateChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {duplicateChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatNumber(value as number), 'Files']}
                          contentStyle={{ borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="error" variant="caption">Failed to load duplicate statistics</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Storage by Category */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                  <ChartIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Storage by Category
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, height: 350 }}>
              {fileStatsLoading ? (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={formatBytes}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(value) => [formatBytes(value as number), 'Size']}
                      contentStyle={{ borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                    No data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Statistics