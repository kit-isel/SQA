import {
  List,
  ListItem,
  Skeleton,
  Stack,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Question from "../types/Question";

interface QuestionListProps {
  questions: Question[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  isLoading: boolean;
}

function QuestionList({
  questions,
  selectedIndex,
  onSelectedIndexChange,
  isLoading,
}: QuestionListProps) {
  return (
    <List>
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </ListItem>
          ))
        : questions.map((question, index) => (
            <ListItem
              key={question.id}
              disablePadding
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => onSelectedIndexChange(index)}
              >
                <ListItemText
                  primary={question.title}
                  secondary={question.description}
                  primaryTypographyProps={{
                    variant: "h6",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "-webkit-box",
                  }}
                  secondaryTypographyProps={{
                    variant: "body1",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "-webkit-box",
                  }}
                  sx={{ width: "10%" }}
                />
                <CommentIcon color="primary" />
                <ListItemText
                  primary={question.answerCounts.toString().padStart(2, "0")}
                />
              </ListItemButton>
            </ListItem>
          ))}
    </List>
  );
}
export default QuestionList;
