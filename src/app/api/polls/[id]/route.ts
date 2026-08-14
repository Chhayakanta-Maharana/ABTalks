import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/polls/[id] - Toggle poll closed state in Database
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const pollId = params.id;
    const body = await req.json();
    const { isClosed } = body;

    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: { isClosed: Boolean(isClosed) },
      include: {
        options: { orderBy: { createdAt: "asc" } }
      }
    });

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
    console.error("Error updating poll status in DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update poll status in database" },
      { status: 500 }
    );
  }
}

// DELETE /api/polls/[id] - Delete a poll from Database
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const pollId = params.id;

    await prisma.poll.delete({
      where: { id: pollId }
    });

    return NextResponse.json({ success: true, message: "Poll deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting poll from DB:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete poll from database" },
      { status: 500 }
    );
  }
}
