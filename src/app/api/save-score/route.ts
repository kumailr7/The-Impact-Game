import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const scoreboardFilePath = path.join(process.cwd(), 'src/data/scoreboard.json');

export async function POST(req: NextRequest) {
  try {
    const { name, score } = await req.json();

    if (!name || typeof score === 'undefined') {
      return NextResponse.json({ message: 'Name and score are required' }, { status: 400 });
    }

    let scoreboard = [];
    if (fs.existsSync(scoreboardFilePath)) {
      const data = fs.readFileSync(scoreboardFilePath, 'utf-8');
      scoreboard = JSON.parse(data);
    }

    scoreboard.push({ name, score, date: new Date().toISOString() });
    scoreboard.sort((a: any, b: any) => b.score - a.score);
    // Keep only top 10 scores
    scoreboard = scoreboard.slice(0, 10);

    fs.writeFileSync(scoreboardFilePath, JSON.stringify(scoreboard, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ message: 'Error saving score' }, { status: 500 });
  }
}