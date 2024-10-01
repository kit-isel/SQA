import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
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
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";

import QuestionList from "../components/QuestionList";
import Question from "../types/Question";
import FilterBox from "../components/FilterBox";

const HEADER_HEIGHT = "64px";

interface QuestionsResponse {
  questions: Question[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

function QuestionsPage() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sort, setSort] = useState("newest");

  const questionsFetcher = ([url, sort]: string) => {
    return fetch(`${url}?sort=${sort}`).then((res) => res.json());
  };
  const { data, isLoading } = useSWR<QuestionsResponse>(
    ["http://localhost:8080/api/v1/questions", sort],
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
          <FilterBox sort={sort} onSortChange={setSort} />
          <QuestionList
            questions={data?.questions || []}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={setSelectedIndex}
            isLoading={isLoading}
          />
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
          {data?.questions[selectedIndex].title}
        </Typography>
        <Typography variant="body1">
          {data?.questions[selectedIndex].description}
        </Typography>
        <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
        <List>
          {data?.questions[selectedIndex].answers.map((answer) => (
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

export default QuestionsPage;
