import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'General'
  const topic = searchParams.get('topic') || 'General'
  const difficulty = searchParams.get('difficulty') || 'medium' // New: default to medium
  const topics = searchParams.get('topics') // New: comma-separated topics

  // Ensure the API key is available
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY environment variable not set.' },
      { status: 500 }
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

  let prompt = `You are an expert in software engineering and DevOps. Generate a multiple-choice question about a realistic software engineering impact scenario. `
  prompt += `The question should be related to the category: ${category}. `

  if (topics) {
    prompt += `Focus on one of these topics: ${topics}. `
  } else {
    prompt += `Focus on the topic: ${topic}. `
  }

  prompt += `The difficulty level should be ${difficulty}. `
  prompt += `The question must describe a detailed, real-world software engineering scenario and ask the user to guess its potential impact. `
  prompt += `Provide four impact levels as options: 'Low', 'Medium', 'High', and 'Critical'. `
  prompt += `The output must be a valid, complete JSON object with the following structure: { "id": number, "category": string, "topic": string, "question": string, "options": ["Low", "Medium", "High", "Critical"], "correctAnswer": string }. `
  prompt += `Ensure the scenario is plausible and the correct answer is well-justified (though the justification is not part of the output).`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Attempt to parse the JSON. The model might sometimes return extra text.
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
    let questionData
    if (jsonMatch && jsonMatch[1]) {
      questionData = JSON.parse(jsonMatch[1])
    } else {
      // Fallback if no code block, try to parse directly
      questionData = JSON.parse(text)
    }

    // Assign a unique ID (for now, a random number)
    questionData.id = Math.floor(Math.random() * 1000000)

    return NextResponse.json(questionData)
  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question.', details: error.message },
      { status: 500 }
    )
  }
}
