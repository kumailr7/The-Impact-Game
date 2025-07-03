'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { Button, Typography, RadioGroup, FormControlLabel, Radio, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useSession } from 'next-auth/react'
import SecurityIcon from '@mui/icons-material/Security'
import CloudIcon from '@mui/icons-material/Cloud'
import StorageIcon from '@mui/icons-material/Storage'
import ApiIcon from '@mui/icons-material/Api'
import ComputerIcon from '@mui/icons-material/Computer'
import PublicIcon from '@mui/icons-material/Public'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import DataObjectIcon from '@mui/icons-material/DataObject'
import MemoryIcon from '@mui/icons-material/Memory'
import { SvgIconComponent } from '@mui/icons-material'

interface Question {
  id: number
  category: string
  topic: string
  question: string
  options: string[]
  correctAnswer: string
}

const ROLES = [
    'Platform Engineer',
    'Solutions Architect',
    'DevOps',
    'DevSecOps',
    'Developer Advocate',
    'SRE',
    'MLOps',
    'System Admins',
    'Incident Responder/Commander',
    'Cybersecurity Analyst'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const topicIcons: { [key: string]: SvgIconComponent } = {
  'Kubernetes': PublicIcon,
  'Infrastructure': ArchitectureIcon,
  'AWS': CloudIcon,
  'GCP': CloudIcon,
  'Azure': CloudIcon,
  'Production Deployment': ComputerIcon,
  'Solutions Architecture': ArchitectureIcon,
  'Database': StorageIcon,
  'Cache': MemoryIcon,
  'Application API': ApiIcon,
  'Security': SecurityIcon,
  'Linux': ComputerIcon,
  'System Design Impacts': ArchitectureIcon, // Added
  'Networking': PublicIcon, // Added
  'Deployment Strategy': ComputerIcon, // Added
  'Large Scale System Failures': SecurityIcon, // Added
  'Cybersecurity': SecurityIcon, // Added
  'Proxy': ComputerIcon,
  'Storage': StorageIcon,
  'DNS': PublicIcon,
  'Git': ComputerIcon,
  'CI-CD': ComputerIcon,
  'Terraform': ComputerIcon,
  'Ansible': ComputerIcon,
  'Zero Trust Network Policy': SecurityIcon,
  'VPN': SecurityIcon,
  'Firewall': SecurityIcon,
  'On-prem': ComputerIcon,
  'Hybrid Infrastructure': ArchitectureIcon,
  'SRE': ComputerIcon,
  'Platform Engineering': ComputerIcon,
  'DevOps': ComputerIcon,
  'DevSecOps': SecurityIcon,
  'MLOps': ComputerIcon,
}

export default function Game() {
  const { data: session } = useSession()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const MAX_QUESTIONS_PER_GAME = 15 // You can adjust this number

  const fetchQuestion = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/generate-question?role=${selectedRole}&difficulty=${selectedDifficulty}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Question = await response.json()
      setCurrentQuestion(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const startGame = () => {
    if (selectedRole && selectedDifficulty) {
        setGameStarted(true);
        fetchQuestion();
    }
  }

  const resetGame = () => {
    setCurrentQuestion(null)
    setSelectedOption('')
    setScore(0)
    setGameOver(false)
    setLoading(false)
    setError(null)
    setQuestionCount(0)
    setGameStarted(false);
    setSelectedRole('');
    setSelectedDifficulty('');
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
    setSelectedOption('')
    setQuestionCount(prevCount => prevCount + 1)

    if (questionCount + 1 >= MAX_QUESTIONS_PER_GAME) {
      setGameOver(true)
      // Save score to scoreboard.json
      try {
        const response = await fetch('/api/save-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: session?.user?.name || 'Player',
            score: score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0),
            userId: session?.user?.id,
            role: selectedRole,
            difficulty: selectedDifficulty,
          }), // Pass the updated score
        })
        console.log('Sending score with name:', session?.user?.name || 'Player')
        if (!response.ok) {
          console.error('Failed to save score')
        }
      } catch (error) {
        console.error('Error saving score:', error)
      }
    } else {
      // Fetch a new question
      fetchQuestion();
    }
  }

  if (!gameStarted) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ background: 'linear-gradient(to right, #a6c1ee, #fbc2eb)' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black' }}>
                Setup Your Game
            </Typography>
            <FormControl fullWidth sx={{ my: 2, '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' }, '& .MuiSelect-select': { color: 'black' }, '& .MuiSvgIcon-root': { color: 'black' } }}>
                <InputLabel>Role</InputLabel>
                <Select value={selectedRole} label="Role" onChange={(e) => setSelectedRole(e.target.value)} MenuProps={{ PaperProps: { sx: { bgcolor: 'white', color: 'black' } } }}>
                    {ROLES.map(role => <MenuItem key={role} value={role} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>{role}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2, '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' }, '& .MuiSelect-select': { color: 'black' }, '& .MuiSvgIcon-root': { color: 'black' } } }>
                <InputLabel>Difficulty</InputLabel>
                <Select value={selectedDifficulty} label="Difficulty" onChange={(e) => setSelectedDifficulty(e.target.value)} MenuProps={{ PaperProps: { sx: { bgcolor: 'white', color: 'black' } } }}>
                    {DIFFICULTIES.map(difficulty => <MenuItem key={difficulty} value={difficulty} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>{difficulty}</MenuItem>)}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={startGame} disabled={!selectedRole || !selectedDifficulty}>
                Start Game
            </Button>
        </div>
    )
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Loading Question...
        </Typography>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      >
        <Typography variant="h4" component="h1" color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Game Over!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your final score is: {score} / {MAX_QUESTIONS_PER_GAME}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={resetGame}
          sx={{ mt: 2, mb: 1 }}
        >
          Play Again
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => window.location.href = '/'}
          sx={{ mt: 1 }}
        >
          Back to Homepage
        </Button>
      </div>
    )
  }

  if (!currentQuestion) {
    return null // Or a loading spinner, if you prefer
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      style={{ background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)' }}
    >
      <Typography variant="h6" color="text.secondary" className="text-gray-700 mb-2 text-lg md:text-xl">
        Question {questionCount + 1} of {MAX_QUESTIONS_PER_GAME}
      </Typography>
      <Typography variant="subtitle1" className="text-blue-600 font-semibold mb-4 text-xl md:text-2xl flex items-center justify-center">
        {currentQuestion.topic && (topicIcons[currentQuestion.topic] ? React.createElement(topicIcons[currentQuestion.topic], { className: "mr-2" }) : <DataObjectIcon className="mr-2" />)}
        Topic: {currentQuestion.topic}
      </Typography>
      <Typography variant="h5" component="h2" className="mb-6 font-bold text-black text-2xl md:text-3xl leading-relaxed">
        {currentQuestion.question}
      </Typography>
      <RadioGroup value={selectedOption} onChange={handleOptionChange} className="mb-6 w-full max-w-xl">
        {currentQuestion.options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio sx={{ color: '#3f51b5', '&.Mui-checked': { color: '#3f51b5' } }} />}
            label={option}
            className={`w-full rounded-lg p-3 my-2 transition-all duration-300 ease-in-out text-gray-800 text-base md:text-lg cursor-pointer transform hover:scale-105 ${
              selectedOption === option ? 'bg-blue-200 border-2 border-blue-600 shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          />
        ))}
      </RadioGroup>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!selectedOption}
        className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        sx={{
          '&:hover': {
            boxShadow: '0 8px 20px rgba(76, 175, 80, 0.5)',
          },
        }}
      >
        Submit
      </Button>
    </div>
  )
}
