import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Fab,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";
import FilterBox from "../components/FilterBox";
import QuestionsPagination from "../components/QuestionsPagination";
import useQuestions from "../hooks/useQuestions";
import QuestionContent from "../components/QuestionContent";

const HEADER_HEIGHT = "64px";

function QuestionsPage() {
  const theme = useTheme();

  const [searchParams, setSearchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const { questions, pagination, isLoading } = useQuestions(
    searchParams.get("sort"),
    searchParams.get("page")
  );

  useEffect(() => {
    if (questions && questions.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(null);
    }
  }, [questions]);

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
          width: drawerOpen ? "360px" : "0px",
          height: `calc(100vh - ${HEADER_HEIGHT})`,
          mt: HEADER_HEIGHT,
          overflow: "hidden",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "width 0.4s",
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
      {questions && selectedIndex !== null && (
        <Box
          sx={{
            height: `calc(100vh - ${HEADER_HEIGHT})`,
            overflow: "scroll",
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            position: "relative",
            mt: HEADER_HEIGHT,
            minWidth: 0,
          }}
        >
          <QuestionContent
            question={questions[selectedIndex]}
            isLoading={isLoading}
          />
          <Fab
            color="primary"
            sx={{ position: "sticky", bottom: 0, left: 0 }}
            href={`/questions/${questions[selectedIndex].id}`}
          >
            <CommentIcon />
          </Fab>
        </Box>
      )}
    </Box>
  );
}

export default QuestionsPage;
