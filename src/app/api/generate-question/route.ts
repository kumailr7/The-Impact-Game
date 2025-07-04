import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || 'DevOps'
  const difficulty = searchParams.get('difficulty') || 'medium'

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

  const roleTopics: { [key: string]: string } = {
    'Platform Engineering': 'Terraform, Kubernetes, Cloud Infrastructure, and automation tools',
    'DevOps': 'CI/CD pipelines, infrastructure as code, containerization, and cloud services',
    'DevSecOps': 'security integration in DevOps, vulnerability scanning, security automation, and threat detection',
    'Solutions Architect': 'decision-making under pressure, architecture design, cost optimization, and system integration',
    'SRE': 'on-call responsibilities, incident response, monitoring, and high availability',
    'Incident Responder': 'handling security incidents, troubleshooting, root cause analysis, and emergency response protocols',
    'MLOps': 'machine learning pipelines, model deployment, data pipelines, and scalability challenges',
    'Cybersecurity Analyst': 'hacking, malware analysis, network security, penetration testing, and threat intelligence',
    'Kubernetes Engineer': 'container orchestration, cluster management, service mesh, and cloud-native networking',
  }

  const topics = roleTopics[role] || 'software engineering and DevOps'

  let prompt = `You are an expert in ${topics}. Generate a multiple-choice question about a realistic software engineering impact scenario. `
  prompt += `The question should be tailored for a ${role} role, focusing on topics like ${topics}. `
  prompt += `The difficulty level should be ${difficulty}. `
  prompt += `The question should be a short, impactful, and concise description of a real-world software engineering scenario, asking the user to guess its potential impact. `
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