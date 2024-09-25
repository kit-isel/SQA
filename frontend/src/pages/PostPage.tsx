import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Toolbar,
  Typography,
  useTheme,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Http } from "@mui/icons-material";

const HEADER_HEIGHT = "64px";

// Post Question Page
function PostPage() {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSend = () => {
    // Send the question to the server
    fetch("http://localhost:8080/api/v1/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学生質問箱
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: HEADER_HEIGHT, width: "100%", px: "10%", py: "5%" }}>
        <TextField
          sx={{ mb: "2em", width: "30%" }}
          label="タイトル"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="質問内容"
          multiline
          fullWidth
          rows={10}
          placeholder="質問内容を入力してください"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Stack
          direction="row"
          sx={{ mt: "2em", pr: "1.5em", justifyContent: "flex-end" }}
        >
          <Button
            sx={{ fontSize: "1em" }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
          >
            投稿する
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default PostPage;
