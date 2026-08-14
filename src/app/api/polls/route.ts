import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRESET_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-[#3B82F6] to-cyan-400",
  "from-violet-500 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-rose-500 to-pink-600"
];

// GET /api/polls - Retrieve all polls with options from Database
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedPolls = polls.map((p) => {
      const totalVotes = p.options.reduce((acc, opt) => acc + opt.votes, 0);
      return {
        id: p.id,
        question: p.question,
        category: p.category,
        expiresInMinutes: p.expiresInMinutes,
        isClosed: p.isClosed,
        createdAt: p.createdAt.toISOString(),
        totalVotes,
        options: p.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votes,
          color: opt.color
        }))
      };
    });

    return NextResponse.json({ success: true, polls: formattedPolls });
  } catch (error: any) {
    console.error("Error fetching polls from DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch polls from database" },
      { status: 500 }
    );
  }
}

// POST /api/polls - Create a new poll with options in Database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, category, options, expiresInMinutes } = body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { success: false, error: "Question and at least 2 options are required" },
        { status: 400 }
      );
    }

    const createdPoll = await prisma.poll.create({
      data: {
        question: question.trim(),
        category: category || "General",
        expiresInMinutes: expiresInMinutes || 20,
        options: {
          create: options.map((optText: string, idx: number) => ({
            text: optText.trim(),
            votes: 0,
            color: PRESET_COLORS[idx % PRESET_COLORS.length]
          }))
        }
      },
      include: {
        options: true
      }
    });

    const formattedPoll = {
      id: createdPoll.id,
      question: createdPoll.question,
      category: createdPoll.category,
      expiresInMinutes: createdPoll.expiresInMinutes,
      isClosed: createdPoll.isClosed,
      createdAt: createdPoll.createdAt.toISOString(),
      totalVotes: 0,
      options: createdPoll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes,
        color: opt.color
      }))
    };

    return NextResponse.json({ success: true, poll: formattedPoll }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating poll in DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create poll in database" },
      { status: 500 }
    );
  }
}
