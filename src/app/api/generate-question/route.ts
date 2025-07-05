import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// In-memory cache with metadata
let questionCache = {
  questions: [] as any[],
  lastFetched: 0,
  generating: false,
  role: '',
  difficulty: '',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PREFETCH_THRESHOLD = 2; // Prefetch when 2 questions are left

async function generateAndCacheQuestions(role: string, difficulty: string) {
    if (questionCache.generating) return; // Prevent concurrent generation
    questionCache.generating = true;

    try {
        console.log(`Generating new questions for role: ${role}, difficulty: ${difficulty}`);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable not set.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        const roleTopics: { [key: string]: string | string[] } = {
            'Platform Engineering': 'Terraform, Kubernetes, Cloud Infrastructure, and automation tools',
            'DevOps': 'CI/CD pipelines, infrastructure as code, containerization, and cloud services',
            'DevSecOps': 'security integration in DevOps, vulnerability scanning, security automation, and threat detection',
            'Solutions Architect': 'decision-making under pressure, architecture design, cost optimization, and system integration',
            'SRE': 'on-call responsibilities, incident response, monitoring, and high availability',
            'Incident Responder': 'handling security incidents, troubleshooting, root cause analysis, and emergency response protocols',
            'MLOps': 'machine learning pipelines, model deployment, data pipelines, and scalability challenges',
            'Cybersecurity Analyst': 'hacking, malware analysis, network security, penetration testing, and threat intelligence',
            'Kubernetes Engineer': [
                'CKA, CKAD, and CKS level knowledge',
                'Kubernetes API Gateway and Ingress management',
                'Backup and Disaster Recovery strategies in Kubernetes',
                'Policy as Code (OPA/Gatekeeper/Kyverno)',
                'Kubernetes security best practices (RBAC, PodSecurity, Secrets management)',
                'Multi-cluster and large-scale production-grade cluster operations',
                'Troubleshooting complex issues in live environments',
            ],
        };

        const topicsForRole = roleTopics[role];
        let topics: string;

        if (Array.isArray(topicsForRole)) {
            topics = topicsForRole[Math.floor(Math.random() * topicsForRole.length)];
        } else {
            topics = topicsForRole || 'software engineering and DevOps';
        }

        let prompt = `You are an expert in ${topics}. Generate 5 multiple-choice questions about realistic software engineering impact scenarios. `;
        prompt += `The questions should be tailored for a ${role} role, focusing on topics like ${topics}. `;
        prompt += `The difficulty level should be ${difficulty}. `;
        prompt += `Each question should be a short, impactful, and concise description of a real-world software engineering scenario, asking the user to guess its potential impact. `;
        prompt += `Provide four impact levels as options: 'Low', 'Medium', 'High', and 'Critical'. `;
        prompt += `The output must be a valid, complete JSON array of objects, with each object having the following structure: { "id": number, "category": string, "topic": string, "question": string, "options": ["Low", "Medium", "High", "Critical"], "correctAnswer": string }. `;
        prompt += `Ensure the scenarios are plausible and the correct answers are well-justified (though the justification is not part of the output).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let newQuestions;
        if (jsonMatch && jsonMatch[1]) {
            newQuestions = JSON.parse(jsonMatch[1]);
        } else {
            newQuestions = JSON.parse(text);
        }

        newQuestions.forEach((q: any) => {
            q.id = Math.floor(Math.random() * 1000000);
        });

        questionCache = {
            questions: newQuestions,
            lastFetched: Date.now(),
            generating: false,
            role: role,
            difficulty: difficulty,
        };
        console.log(`Successfully cached ${newQuestions.length} new questions.`);
    } catch (error) {
        console.error('Error generating and caching questions:', error);
        questionCache.generating = false; // Reset flag on error
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'DevOps';
    const difficulty = searchParams.get('difficulty') || 'medium';

    const now = Date.now();
    const isCacheExpired = now - questionCache.lastFetched > CACHE_DURATION;
    const areParamsChanged = questionCache.role !== role || questionCache.difficulty !== difficulty;

    // Invalidate cache if expired or params change
    if (isCacheExpired || areParamsChanged) {
        questionCache.questions = [];
    }

    try {
        if (questionCache.questions.length === 0 && !questionCache.generating) {
            await generateAndCacheQuestions(role, difficulty);
        }

        // Prefetch if cache is running low and not already generating
        if (questionCache.questions.length <= PREFETCH_THRESHOLD && !questionCache.generating) {
            generateAndCacheQuestions(role, difficulty).catch(console.error);
        }

        const question = questionCache.questions.pop();

        if (!question) {
            return NextResponse.json(
                { error: 'No questions available, please try again shortly.' },
                { status: 503 } // Service Unavailable
            );
        }

        return NextResponse.json(question);
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json(
            { error: 'Failed to generate or retrieve question.', details: error.message },
            { status: 500 }
        );
    }
}