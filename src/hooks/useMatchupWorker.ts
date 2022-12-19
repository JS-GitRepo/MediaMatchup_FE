import { useMemo } from "react";

interface Props {
  file: string;
}

const useMatchupWorker = ({ file }: Props) => {
  const worker = useMemo(() => {
    new Worker(file, { type: "module" });
  }, []);
};

export default useMatchupWorker;
