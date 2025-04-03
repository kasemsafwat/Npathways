import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CourseCard({ image, title, status, time = null }) {
  const colors = [
    { color: "#FFE100", op: 0.35 },
    { color: "#DBDBDB", op: 0.75 },
    { color: "#65FF65", op: 0.75 },
  ];
  let chosenColor;
  if (status === "In Progress") chosenColor = colors[0];
  else if (status === "Completed") chosenColor = colors[2];
  else if (status === "Locked") chosenColor = colors[1];
  return (
    <Card sx={{ width: 345, borderRadius: "30px" }}>
      <div style={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          sx={{ objectFit: "cover", maxHeight: 80 }}
          image={image}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: chosenColor ? chosenColor.color : "transparent",
            opacity: chosenColor ? chosenColor.op : 0,
          }}
        />
      </div>
      <CardContent sx={{ pb: 0 }}>
        <Typography>{title}</Typography>
      </CardContent>
      {!(status === "Not Started") && (
        <CardActions sx={{ pt: 0, px: 2, justifyContent: "space-between" }}>
          <Button size="small" color="text.primary">
            {time ? time : "Continue"}
          </Button>
          <IconButton size="small" color="text.primary">
            <ArrowForwardIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
}
