import {
  Card,
  CardContent,
  CardHeader,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import Question from "../types/Question";

interface QustrionPreviewProps {
  question: Question;
  sx?: SxProps;
}

export default function QuestionPreview({
  question,
  sx,
}: QustrionPreviewProps) {
  const theme = useTheme();
  return (
    <Card sx={sx}>
      <CardContent sx={{ maxHeight: "70vh" }}>
        <Typography variant="body2" color="text.secondary">
          Preview
        </Typography>
        <Typography
          variant="h6"
          sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}
        >
          {question.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          px={theme.spacing(1)}
          py={theme.spacing(2)}
        >
          {question.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
