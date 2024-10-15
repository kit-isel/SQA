import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";
import FilterBox, { FilterConfig } from "../components/FilterBox";
import QuestionsPagination from "../components/QuestionsPagination";
import useQuestions from "../hooks/useQuestions";
import QuestionPreview from "../components/QuestionPreview";

const HEADER_HEIGHT = "64px";

function QuestionsPage() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    sort: searchParams.get("sort") || "newest",
    pagesize: parseInt(searchParams.get("pagesize") || "15"),
    noanswers: searchParams.get("filters") === "noanswers",
  });

  const { questions, pagination, isLoading } = useQuestions(
    searchParams.get("sort"),
    searchParams.get("page"),
    searchParams.get("pagesize"),
    searchParams.get("filters")
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
  const handleFilterApply = () => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", "1");
      prev.set("sort", filterConfig.sort);
      prev.set("pagesize", filterConfig.pagesize.toString());
      prev.set("filters", filterConfig.noanswers ? "noanswers" : "");
      return prev;
    });
  };
  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
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
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={theme.spacing(2)}
        p={theme.spacing(2)}
      >
        <FilterBox
          config={filterConfig}
          onConfigChange={setFilterConfig}
          onApply={handleFilterApply}
          sx={{
            width: "25%",
            height: "fit-content",
            position: "sticky",
            top: `calc(${HEADER_HEIGHT} + ${theme.spacing(2)})`,
          }}
        />
        <Stack direction="column" alignItems="center" width={"50%"}>
          <Typography variant="h4">質問一覧</Typography>
          <QuestionsPagination
            page={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onChange={handlePageChange}
            sx={{
              py: theme.spacing(2),
            }}
          />
          <QuestionList
            questions={questions || []}
            selectedIndex={selectedIndex}
            onHoverIndexChange={setSelectedIndex}
            href={(id: string) => `/questions/${id}`}
            isLoading={isLoading}
            sx={{
              width: "100%",
            }}
          />
          <QuestionsPagination
            page={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onChange={handlePageChange}
            sx={{
              py: theme.spacing(2),
            }}
          />
        </Stack>
        {questions && selectedIndex !== null && (
          <QuestionPreview
            question={questions[selectedIndex]}
            sx={{
              width: "25%",
              height: "fit-content",
              position: "sticky",
              top: `calc(${HEADER_HEIGHT} + ${theme.spacing(2)})`,
            }}
          />
        )}
      </Stack>
    </Box>
  );
}

export default QuestionsPage;
