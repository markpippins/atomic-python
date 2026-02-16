import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Grid,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Save as SaveIcon,
  Search as TestIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { configApi } from '@/services/api'

interface DatabaseConfig {
  redis_url: string
  mongodb_url: string
  mysql_url: string
}

const Configuration: React.FC = () => {
  const navigate = useNavigate()
  const { data: currentConfig, refetch } = useQuery({
    queryKey: ['config'],
    queryFn: () => configApi.getConfig(),
    retry: false,
  })

  const [config, setConfig] = useState<DatabaseConfig>({
    redis_url: currentConfig?.redis_url || 'redis://localhost:6379',
    mongodb_url: currentConfig?.mongodb_url || 'mongodb://localhost:27017',
    mysql_url: currentConfig?.mysql_url || 'mysql://media:changeme@localhost:3306/media',
  })

  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'testing'>>({})

  const saveConfigMutation = useMutation({
    mutationFn: (newConfig: DatabaseConfig) => configApi.saveConfig(newConfig),
    onSuccess: () => {
      toast.success('Configuration saved successfully')
      refetch()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to save configuration')
    },
  })

  const testConnectionMutation = useMutation({
    mutationFn: (database: 'redis_url' | 'mongodb_url' | 'mysql_url') => {
      setTestResults(prev => ({ ...prev, [database]: 'testing' }))
      return configApi.testConnection(database)
    },
    onSuccess: (response, variables) => {
      const dbKey = variables as 'redis_url' | 'mongodb_url' | 'mysql_url'
      setTestResults(prev => ({ ...prev, [dbKey]: 'success' }))
      toast.success(`${dbKey} connection test successful`)
    },
    onError: (error, variables) => {
      const dbKey = variables as 'redis_url' | 'mongodb_url' | 'mysql_url'
      setTestResults(prev => ({ ...prev, [dbKey]: 'error' }))
      toast.error(`${dbKey} connection test failed: ${error.response?.data?.detail || 'Unknown error'}`)
    },
  })

  const resetConfigMutation = useMutation({
    mutationFn: configApi.resetConfig,
    onSuccess: () => {
      toast.success('Configuration reset to defaults')
      refetch()
    },
  })

  const initDbMutation = useMutation({
    mutationFn: (database: 'redis_url' | 'mongodb_url' | 'mysql_url') => {
      setTestResults(prev => ({ ...prev, [database]: 'testing' }))
      return configApi.initializeDatabase(database)
    },
    onSuccess: (response, variables) => {
      const dbKey = variables as 'redis_url' | 'mongodb_url' | 'mysql_url'
      setTestResults(prev => ({ ...prev, [dbKey]: 'success' }))
      toast.success(`${dbKey} initialized successfully`)
      refetch()
    },
    onError: (error, variables) => {
      const dbKey = variables as 'redis_url' | 'mongodb_url' | 'mysql_url'
      setTestResults(prev => ({ ...prev, [dbKey]: 'error' }))
      toast.error(`${dbKey} initialization failed: ${error.response?.data?.detail || 'Unknown error'}`)
    },
  })

  const handleSave = () => {
    saveConfigMutation.mutate(config)
  }

  const handleTest = (database: 'redis_url' | 'mongodb_url' | 'mysql_url') => {
    testConnectionMutation.mutate(database)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all configuration to defaults?')) {
      resetConfigMutation.mutate()
    }
  }

  const handleInitialize = (database: 'redis_url' | 'mongodb_url' | 'mysql_url') => {
    if (confirm(`Are you sure you want to initialize ${database}? This may create or reset the database schema.`)) {
      initDbMutation.mutate(database)
    }
  }

  const getStatusIcon = (database: 'redis_url' | 'mongodb_url' | 'mysql_url') => {
    switch (database) {
      case 'redis_url': return 'R'
      case 'mongodb_url': return 'M'
      case 'mysql_url': return 'S'
      default: return '?'
    }
  }

  const getStatusColor = (database: 'redis_url' | 'mongodb_url' | 'mysql_url', status: 'success' | 'error' | 'testing' | undefined) => {
    switch (status) {
      case 'success': return 'success'
      case 'error': return 'error'
      case 'testing': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Database Configuration
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={currentConfig === undefined}
        >
          Refresh
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure database connections for the media metadata service. Each database is optional - the service will run with available databases only.
      </Alert>

      <Grid container spacing={3}>
        {/* Redis Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Redis Configuration
              </Typography>
              <TextField
                fullWidth
                label="Redis URL"
                value={config.redis_url}
                onChange={(e) => setConfig(prev => ({ ...prev, redis_url: e.target.value }))}
                margin="normal"
                size="small"
                helperText="Connection string for Redis cache and scan state management"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleTest('redis_url')}
                  disabled={testResults.redis_url === 'testing'}
                  title="Test Connection"
                >
                  <TestIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleInitialize('redis_url')}
                  title="Initialize Schema"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              {testResults.redis_url && (
                <Chip
                  label={`Status: ${testResults.redis_url}`}
                  color={getStatusColor('redis_url', testResults.redis_url)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* MongoDB Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                MongoDB Configuration
              </Typography>
              <TextField
                fullWidth
                label="MongoDB URL"
                value={config.mongodb_url}
                onChange={(e) => setConfig(prev => ({ ...prev, mongodb_url: e.target.value }))}
                margin="normal"
                size="small"
                helperText="Connection string for MongoDB file metadata storage"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleTest('mongodb_url')}
                  disabled={testResults.mongodb_url === 'testing'}
                  title="Test Connection"
                >
                  <TestIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleInitialize('mongodb_url')}
                  title="Initialize Schema"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              {testResults.mongodb_url && (
                <Chip
                  label={`Status: ${testResults.mongodb_url}`}
                  color={getStatusColor('mongodb_url', testResults.mongodb_url)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* MySQL Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                MySQL Configuration
              </Typography>
              <TextField
                fullWidth
                label="MySQL URL"
                value={config.mysql_url}
                onChange={(e) => setConfig(prev => ({ ...prev, mysql_url: e.target.value }))}
                margin="normal"
                size="small"
                helperText="Connection string for MySQL library configuration storage"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleTest('mysql_url')}
                  disabled={testResults.mysql_url === 'testing'}
                  title="Test Connection"
                >
                  <TestIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleInitialize('mysql_url')}
                  title="Initialize Schema"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              {testResults.mysql_url && (
                <Chip
                  label={`Status: ${testResults.mysql_url}`}
                  color={getStatusColor('mysql_url', testResults.mysql_url)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saveConfigMutation.isPending}
          sx={{ minWidth: 120 }}
        >
          Save Configuration
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={resetConfigMutation.isPending}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  )
}

export default Configuration