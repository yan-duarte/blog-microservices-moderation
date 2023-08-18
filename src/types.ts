export interface Event {
  type: string;
  data: Record<string, unknown>;
}

export type EventCommentCreated = {
  id: string;
  postId: string;
  content: string;
  status: "pending" | "approved" | "rejected";
};
