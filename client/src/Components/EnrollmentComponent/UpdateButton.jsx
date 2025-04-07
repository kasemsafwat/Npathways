import { ModeEditOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
export default function UpdateButton() {
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, m: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#46C98B",
            "&:hover": {
              backgroundColor: "#3aa87a",
            },
          }}
        >
          <ModeEditOutlinedIcon />
        </Button>
      </Box>
    </div>
  );
}
