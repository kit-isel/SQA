import { Divider, List, ListItem, SxProps, Typography } from "@mui/material";
import Question from "../types/Question";
import { Stack } from "@mui/system";

interface QuestionContentProps {
  question: Question;
}

export default function QuestionContent({ question }: QuestionContentProps) {
  return (
    <Stack direction="column" component="main" sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 2,
          width: "100%",
          overflowWrap: "break-word",
        }}
      >
        {question.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          width: "100%",
          overflowWrap: "break-word",
        }}
      >
        {question.description}
      </Typography>
      <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
      <List>
        {question.answers.map((answer) => (
          <ListItem
            key={answer.id}
            sx={{
              backgroundColor: "grey.200",
              borderRadius: 2,
              p: 2,
              my: 2,
            }}
          >
            <Typography>{answer.description}</Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
