import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
  FormGroup,
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useSWR from "swr";
import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import PostPage from "./PostPage";

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

function QuestionsPage() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sort, setSort] = useState("newest");

  const questionsFetcher = (url: string) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error, isLoading } = useSWR<Question[]>(
    () => {
      const query = new URLSearchParams({ sort: sort });
      return `http://localhost:8080/api/v1/questions?${query}`;
    },
    (url: string) => questionsFetcher(url)
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
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<EditIcon />}
            component={Link}
            to="/questions/post"
          >
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
          <Accordion
            disableGutters
            sx={{
              p: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>ソート・フィルター</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <FormControl>
                  <FormLabel id="created-at-radio-group-label">
                    ソート
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="created-at-radio-group-label"
                    defaultValue="newest"
                    name="created-at-radio-button-group"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <FormControlLabel
                      value="newest"
                      control={<Radio />}
                      label="Newest"
                    />
                    <FormControlLabel
                      value="oldest"
                      control={<Radio />}
                      label="Oldest"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <FormLabel component="legend">フィルター</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="未回答"
                    />
                  </FormGroup>
                </FormControl>
              </Typography>
            </AccordionDetails>
          </Accordion>
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
      <Routes>
        <Route path="/questions/post" element={<PostPage />} />
      </Routes>
    </Box>
  );
}

export default QuestionsPage;
