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
import { useNavigate } from "react-router-dom";

const HEADER_HEIGHT = "64px";

// Post Question Page
function PostPage() {
  const theme = useTheme();
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleSend = () => {
    if (
      title === "" ||
      title === undefined ||
      description === "" ||
      description === undefined
    ) {
      alert("タイトルと質問内容を入力してください");
      return;
    }

    if (title.length < 8 || title.length > 100) {
      alert("タイトルは8文字以上100文字以内で入力してください");
      return;
    }

    if (description.length < 10 || description.length > 1000) {
      alert("質問内容は10文字以上1000文字以内で入力してください");
      return;
    }

    fetch("http://localhost:8080/api/v1/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    navigate("/");
  };

  const checkTitle = () => {
    if (title === "") {
      return true;
    }
    if (title !== undefined && (title.length < 8 || title.length > 100)) {
      return true;
    }
    return false;
  };

  const getTitleHelperText = () => {
    if (title === "") {
      return "タイトルを入力してください";
    }
    if (title !== undefined && title.length < 8) {
      return "タイトルは8文字以上で入力してください";
    }
    if (title !== undefined && title.length > 100) {
      return "タイトルは100文字以内で入力してください";
    }
    return "";
  };

  const checkDescription = () => {
    if (description === "") {
      return true;
    }
    if (
      description !== undefined &&
      (description.length < 10 || description.length > 1000)
    ) {
      return true;
    }
    return false;
  };

  const getDescriptionHelperText = () => {
    if (description === "") {
      return "質問内容を入力してください";
    }
    if (description !== undefined && description.length < 10) {
      return "質問内容は10文字以上で入力してください";
    }
    if (description !== undefined && description.length > 1000) {
      return "質問内容は1000文字以内で入力してください";
    }
    return "";
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
          required
          error={checkTitle()}
          helperText={getTitleHelperText()}
          label="タイトル"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          required
          error={checkDescription()}
          helperText={getDescriptionHelperText()}
          label="質問内容"
          multiline
          fullWidth
          rows={10}
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
