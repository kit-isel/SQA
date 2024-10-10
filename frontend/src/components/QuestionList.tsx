import {
  Skeleton,
  SxProps,
  Stack,
  Card,
  CardContent,
  Typography,
  useTheme,
  CardActionArea,
  Box,
  alpha,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Question from "../types/Question";

interface QuestionListProps {
  questions: Question[];
  selectedIndex: number | null;
  onHoverIndexChange: (index: number | null) => void;
  href: (id: string) => string;
  isLoading: boolean;
  sx?: SxProps;
}

function QuestionList({
  questions,
  selectedIndex,
  onHoverIndexChange,
  href,
  isLoading,
  sx,
}: QuestionListProps) {
  const theme = useTheme();
  return (
    <Stack direction="column" sx={sx} spacing={theme.spacing(2)}>
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} sx={{ height: "96px", p: "8px" }}>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Card>
          ))
        : questions.map((question, index) => (
            <Card
              key={question.id}
              sx={{
                minHeight: "96px",
              }}
            >
              <CardActionArea
                component="a"
                href={href(`${question.id}`)}
                onMouseEnter={() => onHoverIndexChange(index)}
                sx={{
                  display: "flex",
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {question.createdAt}
                  </Typography>
                  <Typography variant="h6">{question.title}</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      maxHeight: "96px",
                    }}
                  >
                    {question.description}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "72px",
                    minHeight: "72px",
                    borderLeft: 1,
                    borderColor: "divider",
                    padding: theme.spacing(1),
                  }}
                >
                  <CommentIcon
                    color={question.answerCounts > 0 ? "primary" : "disabled"}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mx: theme.spacing(1) }}
                  >
                    {question.answerCounts > 99 ? "99+" : question.answerCounts}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
    </Stack>
  );
}
export default QuestionList;
