import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";
import FilterBox from "../components/FilterBox";
import QuestionsPagination from "../components/QuestionsPagination";
import useQuestions from "../hooks/useQuestions";

const HEADER_HEIGHT = "64px";

function QuestionsPage() {
  const theme = useTheme();

  const [searchParams, setSearchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const { questions, pagination, isLoading } = useQuestions(
    searchParams.get("sort"),
    searchParams.get("page")
  );

  const handlePageChange = (page: number) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", page.toString());
      return prev;
    });
  };
  const handleSortChange = (sort: string) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("sort", sort);
      return prev;
    });
    setSort(sort);
  };
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
      <Stack
        direction="column"
        sx={{
          width: drawerOpen ? 360 : 0,
          height: `calc(100vh - ${HEADER_HEIGHT})`,
          mt: HEADER_HEIGHT,
          overflow: "hidden",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <FilterBox sort={sort} onSortChange={handleSortChange} />
        <Box overflow="scroll">
          <Stack direction="column" alignItems="center" spacing="8px">
            <QuestionsPagination
              page={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              onChange={handlePageChange}
            />
            <QuestionList
              questions={questions || []}
              selectedIndex={selectedIndex}
              onSelectedIndexChange={setSelectedIndex}
              isLoading={isLoading}
            />
            <QuestionsPagination
              page={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              onChange={handlePageChange}
            />
          </Stack>
        </Box>
      </Stack>
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
          {questions?.[selectedIndex].title}
        </Typography>
        <Typography variant="body1">
          {questions?.[selectedIndex].description}
        </Typography>
        <Divider orientation="horizontal" sx={{ width: "100%", my: 4 }} />
        <List>
          {questions?.[selectedIndex].answers.map((answer) => (
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
