import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Alert,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Scanner as ScannerIcon,
  ContentCopy as DuplicateIcon,
  Analytics as StatsIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material'
import { useSystemStatus, useFileStats, useDuplicateStats, useScanStatus, useStartScan, useStopScan } from '@/hooks/useApi'
import { formatDistanceToNow } from 'date-fns'

const Dashboard: React.FC = () => {
  const { data: systemStatus, isLoading: systemLoading } = useSystemStatus()
  const { data: fileStats, isLoading: fileStatsLoading } = useFileStats()
  const { data: duplicateStats, isLoading: duplicateStatsLoading } = useDuplicateStats()
  const { data: scanStatus, isLoading: scanStatusLoading } = useScanStatus()

  const startScanMutation = useStartScan()
  const stopScanMutation = useStopScan()

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getUptimeString = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const hasActiveScans = scanStatus && scanStatus.active_scans > 0
  const isScanning = hasActiveScans

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            size="small"
            sx={{ borderRadius: 1, textTransform: 'none', px: 2, py: 1 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* System Status Alert */}
      {systemStatus && systemStatus.system_status !== 'running' && (
        <Alert
          severity="warning"
          sx={{ mb: 2, borderRadius: 1 }}
          iconMapping={{ warning: <ErrorIcon /> }}
        >
          System status: {systemStatus.system_status}
        </Alert>
      )}

      {/* Quick Actions */}
      <Card sx={{ mb: 3, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1.2rem' }} />
              Quick Actions
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              startIcon={isScanning ? <StopIcon /> : <PlayIcon />}
              onClick={() => isScanning ? stopScanMutation.mutate() : startScanMutation.mutate()}
              disabled={startScanMutation.isPending || stopScanMutation.isPending}
              color={isScanning ? 'error' : 'primary'}
              size="small"
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              {isScanning ? 'Stop Scan' : 'Start Scan'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              size="small"
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Refresh Data
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* System Overview */}
        <Grid item xs={12} sm={6} md={4} xl={2.4}>
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
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  System
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {systemLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : systemStatus ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Version: {systemStatus.version}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Uptime: {getUptimeString(systemStatus.uptime_seconds)}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Started: {formatDistanceToNow(new Date(systemStatus.startup_time))} ago
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      label={systemStatus.system_status}
                      color={systemStatus.system_status === 'running' ? 'success' : 'warning'}
                      size="small"
                      icon={
                        systemStatus.system_status === 'running' ?
                          <CheckCircleIcon fontSize="small" /> :
                          <ErrorIcon fontSize="small" />
                      }
                      sx={{ borderRadius: 12, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* File Statistics */}
        <Grid item xs={12} sm={6} md={4} xl={2.4}>
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
                <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                  <StatsIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Files
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {fileStatsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : fileStats ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {formatNumber(fileStats.total_files)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Total Files Indexed
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {formatNumber(fileStats.total_directories)} directories
                  </Typography>

                  {fileStats.by_category.length > 0 && (
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}>
                        Top Categories:
                      </Typography>
                      {fileStats.by_category.slice(0, 3).map((category) => (
                        <Box key={category._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            {category._id}:
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatNumber(category.count)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Scan Status */}
        <Grid item xs={12} sm={6} md={4} xl={2.4}>
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
                <Avatar sx={{ bgcolor: hasActiveScans ? 'warning.main' : 'success.main', width: 32, height: 32 }}>
                  <ScannerIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
              }
              title={
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Scanning
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {scanStatusLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              ) : scanStatus ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h5"
                    color={hasActiveScans ? 'warning.main' : 'success.main'}
                    sx={{ fontWeight: 700, mb: 0.5 }}
                  >
                    {scanStatus.active_scans}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Active Scans
                  </Typography>

                  {hasActiveScans && scanStatus.scans.length > 0 && (
                    <Box sx={{ mt: 'auto' }}>
                      {scanStatus.scans.slice(0, 2).map((scan, index) => (
                        <Box key={index} sx={{ mb: 0.75 }}>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {scan.path}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                              label={scan.status}
                              size="small"
                              color={scan.status === 'running' ? 'warning' : 'default'}
                              sx={{ borderRadius: 12, height: 18, fontSize: '0.6rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatNumber(parseInt(scan.files_processed))} files
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography color="error" variant="caption">Failed to load</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Duplicate Statistics */}
        <Grid item xs={12} sm={6} md={4} xl={2.4}>
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
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Duplicates
                </Typography>
              }
              sx={{ pb: 0.5, pt: 1, px: 1 }}
            />
            <CardContent sx={{ pt: 0.5, flex: 1, pb: 1 }}>
              {duplicateStatsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <LinearProgress sx={{ width: '100%' }} />
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
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatNumber(duplicateStats.duplicate_files)} total duplicates
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatNumber(duplicateStats.deletion_candidates)} marked for deletion
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatNumber(duplicateStats.best_quality_files)} best quality marked
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

      {/* Recent Activity */}
      <Card
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
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
              <FolderIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Recent Activity
            </Typography>
          }
          action={
            <IconButton aria-label="settings" size="small">
              <MoreIcon />
            </IconButton>
          }
          sx={{ pb: 0.5, pt: 1, px: 1 }}
        />
        <CardContent sx={{ pt: 0.5 }}>
          {scanStatus && scanStatus.scans.length > 0 ? (
            <Box>
              {scanStatus.scans.map((scan, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < scanStatus.scans.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{scan.path}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Started: {formatDistanceToNow(new Date(scan.started_at))} ago
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(parseInt(scan.files_processed))} files
                    </Typography>
                    <Chip
                      label={scan.status}
                      size="small"
                      color={
                        scan.status === 'running' ? 'warning' :
                        scan.status === 'completed' ? 'success' : 'error'
                      }
                      sx={{ borderRadius: 12, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <FolderIcon sx={{ fontSize: 36, color: 'action.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No Recent Activity
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Start a scan to see activity here
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard