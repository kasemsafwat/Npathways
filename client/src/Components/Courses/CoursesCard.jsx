import {
  Avatar,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

function CoursesCard({ course }) {
  return (
    <Grid item key={course._id} xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {course.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Instructors:
          </Typography>
          {course.instructors.length > 0 ? (
            <List dense>
              {course.instructors.map((instructor, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {instructor.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={instructor.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No instructors assigned.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CoursesCard;
