
'use client'

import { useState, useEffect } from 'react'
import { Container, Typography, List, ListItem, ListItemText, Paper, Box } from '@mui/material'

export default function Scoreboard() {
  const [scoreboard, setScoreboard] = useState([])

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await fetch('/api/scoreboard')
        if (response.ok) {
          const data = await response.json()
          setScoreboard(data)
        } else {
          console.error('Failed to fetch scoreboard')
        }
      } catch (error) {
        console.error('Error fetching scoreboard:', error)
      }
    }
    fetchScoreboard()
  }, [])

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, maxWidth: 600, width: '100%', backgroundColor: '#ffffff', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Scoreboard
        </Typography>
        {scoreboard.length === 0 ? (
          <Typography variant="h6" color="text.secondary">No scores yet. Play a game to add yours!</Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {scoreboard.map((entry: any, index: number) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0',
                  borderRadius: 1,
                  marginBottom: '8px',
                  padding: '10px 15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>
                      {index + 1}. {entry.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  }
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                  {entry.score}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}
