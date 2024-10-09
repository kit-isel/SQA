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
}

const fetcher = ({ url, sort, page }: QuestionsFetcherProps) => {
  const query = new URLSearchParams();
  if (sort) {
    query.append("sort", sort);
  }
  if (page) {
    query.append("page", page);
  }
  return fetch(`${url}?${query.toString()}`).then((res) => res.json());
};

export default function useQuestions(sort: string | null, page: string | null) {
  const { data, error, isLoading } = useSWR<
    QuestionsResponse,
    any,
    QuestionsFetcherProps
  >(
    {
      url: `http://${import.meta.env.VITE_APP_HOST}/api/v1/questions`,
      sort: sort,
      page: page,
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
