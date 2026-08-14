import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/polls/[id]/vote - Record a vote in Database
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const pollId = params.id;
    const body = await req.json();
    const { optionId, prevOptionId } = body;

    if (!optionId) {
      return NextResponse.json(
        { success: false, error: "Option ID is required" },
        { status: 400 }
      );
    }

    // Verify poll is open
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) {
      return NextResponse.json({ success: false, error: "Poll not found" }, { status: 404 });
    }
    if (poll.isClosed) {
      return NextResponse.json({ success: false, error: "Poll is closed" }, { status: 400 });
    }

    // Run transaction to update option counts in DB
    await prisma.$transaction(async (tx) => {
      // Increment chosen option
      await tx.pollOption.update({
        where: { id: optionId },
        data: { votes: { increment: 1 } }
      });

      // Decrement previous option if revoting
      if (prevOptionId && prevOptionId !== optionId) {
        await tx.pollOption.update({
          where: { id: prevOptionId },
          data: { votes: { decrement: 1 } }
        });
      }
    });

    // Return refreshed poll state from DB
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: { orderBy: { createdAt: "asc" } }
      }
    });

    if (!updatedPoll) {
      return NextResponse.json({ success: false, error: "Poll state update failed" }, { status: 500 });
    }

    const totalVotes = updatedPoll.options.reduce((acc, opt) => acc + opt.votes, 0);

    return NextResponse.json({
      success: true,
      poll: {
        id: updatedPoll.id,
        question: updatedPoll.question,
        category: updatedPoll.category,
        expiresInMinutes: updatedPoll.expiresInMinutes,
        isClosed: updatedPoll.isClosed,
        createdAt: updatedPoll.createdAt.toISOString(),
        totalVotes,
        options: updatedPoll.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votes,
          color: opt.color
        }))
      }
    });
  } catch (error: any) {
    console.error("Error saving vote to DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record vote in database" },
      { status: 500 }
    );
  }
}
