import { Divider, List, ListItem, Typography, Skeleton } from "@mui/material";
import Question from "../types/Question";
import { Stack } from "@mui/system";

interface QuestionContentProps {
  question: Question;
  isLoading: boolean;
}

export default function QuestionContent({
  question,
  isLoading,
}: QuestionContentProps) {
  return (
    <Stack direction="column" sx={{ maxWidth: "100%", minWidth: 0 }}>
      {isLoading ? (
        <>
          <Skeleton variant="text" />
          <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
          <Skeleton variant="text" />
          <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index}>
                <Skeleton variant="text" sx={{ width: "100%" }} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              mb: 2,
              width: "100%",
              overflowWrap: "break-word",
              wordBreak: "break-all",
              minWidth: 0,
            }}
          >
            {question.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              width: "100%",
              overflowWrap: "break-word",
              wordBreak: "break-all",
              minWidth: 0,
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
                <Typography
                  variant="body1"
                  sx={{
                    width: "100%",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                    minWidth: 0,
                  }}
                >
                  {answer.description}
                </Typography>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}
