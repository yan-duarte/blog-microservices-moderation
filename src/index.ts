import express from "express";
import { json } from "body-parser";
import { Event, EventCommentCreated } from "./types";
import axios from "axios";

const app = express();
app.use(json());

const handleEvent = async ({ type, data }: Event) => {
  switch (type) {
    case "CommentCreated":
      const { postId, ...comment } = data as EventCommentCreated;
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          postId,
          ...comment,
          status: comment.content.includes("orange") ? "rejected" : "approved",
        },
      });
      break;
  }
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Received Event", { type, data });

  await handleEvent({ type, data });

  res.send({});
});

app.listen(4003, async () => {
  console.log("Listening on 4003");

  const { data: events } = await axios.get<Event[]>(
    "http://localhost:4005/events"
  );

  await Promise.all(
    events.map(async (event) => {
      console.log("Processing event: ", event.type);
      await handleEvent(event);
    })
  );
});
