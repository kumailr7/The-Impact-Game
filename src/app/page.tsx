'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button, Typography, Box } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'linear-gradient(to right, #a6c1ee, #fbc2eb)' }} // Soft gradient
      >
        <Typography variant="h4" component="h1" gutterBottom className="text-black font-bold text-shadow-lg text-3xl md:text-5xl">
          Welcome, {session.user?.name}
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <Button
            variant="contained"
            onClick={() => signOut()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out flex-grow sm:flex-grow-0"
          >
            Sign out
          </Button>
          <Button
            variant="contained"
            href="/game"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out flex-grow sm:flex-grow-0"
          >
            Play Game
          </Button>
          <Button
            variant="contained"
            href="/scoreboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out flex-grow sm:flex-grow-0"
          >
            Scoreboard
          </Button>
        </Box>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ background: 'linear-gradient(to right, #a6c1ee, #fbc2eb)' }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          padding: 6,
          maxWidth: 600,
          width: '100%',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom className="text-gray-800 font-bold text-shadow-md text-3xl md:text-5xl">
          The Impact Level Game
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom className="text-gray-600 mb-8 text-lg md:text-xl">
          Guess the impact level of various software engineering scenarios!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => signIn('google')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out md:text-xl"
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Typography variant="body1" className="mt-6 text-gray-800 font-bold">
          Made by Kumail Rizvi -{' '}
          <a
            href="https://www.linkedin.com/in/kumail-rizvi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline flex items-center justify-center"
          >
            <LinkedInIcon className="mr-1" /> LinkedIn
          </a>
        </Typography>
      </Box>
    </div>
  )
}