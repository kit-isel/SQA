import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import useSWR from "swr";
import { useState } from "react";

interface Answer {
  id: number;
  questionId: number;
  description: string;
  isBest: boolean;
  createdAt: string;
}
interface Question {
  id: number;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
  answers: Answer[];
  answerCounts: number;
}

const HEADER_HEIGHT = "64px";

function App() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const questionsFetcher = async () => {
    return fetch("http://127.0.0.1:8080/api/v1/questions").then((res) =>
      res.json()
    );
  };
  const { data, error, isLoading } = useSWR<Question[]>(
    "http://localhost:8080/api/v1/questions",
    questionsFetcher
  );
  console.log(data);
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ height: HEADER_HEIGHT }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            学生質問箱
          </Typography>
          <Button variant="outlined" color="inherit" startIcon={<EditIcon />}>
            質問する
          </Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? 360 : 0,
            flexShrink: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            "& .MuiDrawer-paper": {
              width: 360,
              boxSizing: "border-box",
              pt: HEADER_HEIGHT,
            },
          }}
        >
          {isLoading ? (
            <Typography>ロード中...</Typography>
          ) : (
            <List sx={{ flexGrow: 1, p: 0 }}>
              {data?.map((question, index) => (
                <ListItem
                  key={question.id}
                  sx={{
                    pl: index === selectedIndex ? 2 : 1,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={() => setSelectedIndex(index)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction={"column"}>
                      <Typography
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "1",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {question.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {question.description}
                        {/* {question.description.length > 30
                          ? question.description.slice(0, 30) + "..."
                          : question.description} */}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"}>
                      <CommentIcon color="primary" />
                      <Typography>
                        {question.answerCounts.toString().padStart(2, "0")}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Typography
          variant="h4"
          component="h1"
          sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 2 }}
        >
          {data?.[selectedIndex].title}
        </Typography>
        <Typography variant="body1">
          {data?.[selectedIndex].description}
        </Typography>
        <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
        <List>
          {data?.[selectedIndex].answers.map((answer) => (
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
        <Fab color="primary" sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <CommentIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default App;
