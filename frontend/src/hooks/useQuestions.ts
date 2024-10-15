import useSWR from "swr";
import Question from "../types/Question";

interface QuestionsResponse {
  questions: Question[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

interface QuestionsFetcherProps {
  url: string;
  sort: string | null;
  page: string | null;
  pagesize: string | null;
  filters: string | null;
}

const fetcher = ({
  url,
  sort,
  page,
  pagesize,
  filters,
}: QuestionsFetcherProps) => {
  const query = new URLSearchParams();
  if (sort) {
    query.append("sort", sort);
  }
  if (page) {
    query.append("page", page);
  }
  if (pagesize) {
    query.append("pagesize", pagesize);
  }
  if (filters) {
    query.append("filters", filters);
  }

  return fetch(`${url}?${query.toString()}`).then((res) => res.json());
};

export default function useQuestions(
  sort: string | null,
  page: string | null,
  pagesize: string | null,
  filters: string | null
) {
  const { data, error, isLoading } = useSWR<
    QuestionsResponse,
    any,
    QuestionsFetcherProps
  >(
    {
      url: `http://${import.meta.env.VITE_APP_HOST}/api/v1/questions`,
      sort,
      page,
      pagesize,
      filters,
    },
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    questions: data?.questions,
    pagination: data?.pagination,
    error,
    isLoading,
  };
}
