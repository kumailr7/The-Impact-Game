import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const scoreboardFilePath = path.join(process.cwd(), 'src/data/scoreboard.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (fs.existsSync(scoreboardFilePath)) {
      const data = fs.readFileSync(scoreboardFilePath, 'utf-8');
      let scoreboard = JSON.parse(data);

      if (userId) {
        scoreboard = scoreboard.filter((entry: any) => entry.userId === userId);
      }
      return NextResponse.json(scoreboard);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error reading scoreboard:', error);
    return NextResponse.json({ message: 'Error reading scoreboard' }, { status: 500 });
  }
}