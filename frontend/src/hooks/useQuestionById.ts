import useSWR from "swr";
import Question from "../types/Question";

interface FetcherProps {
  url: string;
  id: string;
}

const fetcher = ({ url, id }: FetcherProps) => {
  return fetch(`${url}/${id}`).then((res) => res.json());
};

export default function useQuestionById(id: string) {
  const { data, error, isLoading } = useSWR<Question, any, FetcherProps>(
    {
      url: `http://${import.meta.env.VITE_APP_HOST}/api/v1/questions`,
      id,
    },
    fetcher
  );

  return {
    question: data,
    error,
    isLoading,
  };
}
