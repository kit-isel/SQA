import {
  AppBar,
  Box,
  Button,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionContent from "../components/QuestionContent";
import useQuestionById from "../hooks/useQuestionById";
import AnswerForm from "../components/AnswerForm";

export default function QuestionDetailPage() {
  const theme = useTheme();

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { question, isLoading } = useQuestionById(id || "1");

  const handleSend = async (description: string) => {
    if (description === "" || description === undefined) {
      alert("タイトルと質問内容を入力してください");
      return;
    }

    if (description.length < 10 || description.length > 1000) {
      alert("質問内容は10文字以上1000文字以内で入力してください");
      return;
    }

    await fetch(`http://localhost:8080/api/v1/questions/${id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    navigate("/");
  };
  return (
    <Stack direction="row">
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Button component={Link} to="/">
            <Typography variant="h6" component="div" sx={{ color: "white" }}>
              学生質問箱
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "50%",
          marginTop: "64px",
          p: "16px",
          height: "calc(100vh - 64px)",
          overflowY: "scroll",
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        {question && <QuestionContent question={question} />}
      </Box>
      <Stack
        direction="column"
        sx={{
          width: "50%",
          mt: "64px",
          p: "16px",
          height: "calc(100vh - 64px)",
          overflowY: "scroll",
        }}
      >
        <AnswerForm onSend={handleSend} />
      </Stack>
    </Stack>
  );
}
