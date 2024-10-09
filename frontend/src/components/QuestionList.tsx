import {
  List,
  ListItem,
  Skeleton,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Question from "../types/Question";

interface QuestionListProps {
  questions: Question[];
  selectedIndex: number | null;
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
    <List
      disablePadding
      sx={{
        width: "100%",
        height: "100%",
        borderTop: 1,
        borderColor: "divider",
        "&.MuiList-root": {
          margin: 0,
        },
      }}
    >
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <ListItem key={index}>
              <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
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
                  sx={{ width: "80%" }}
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
