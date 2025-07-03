import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const scoreboardFilePath = path.join(process.cwd(), 'src/data/scoreboard.json');

export async function GET() {
  try {
    if (fs.existsSync(scoreboardFilePath)) {
      const data = fs.readFileSync(scoreboardFilePath, 'utf-8');
      const scoreboard = JSON.parse(data);
      return NextResponse.json(scoreboard);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error reading scoreboard:', error);
    return NextResponse.json({ message: 'Error reading scoreboard' }, { status: 500 });
  }
}