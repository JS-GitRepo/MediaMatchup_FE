import "./styles/Loading.css";
import loading from "../images/loading.svg";
import { useState } from "react";

interface Props {
  adtlClassName: string;
}

const Loading = ({ adtlClassName }: Props) => {
  const [triggerRefreshMsg, setTriggerRefreshMsg] = useState<boolean>(false);

  const loadingRefreshPrompt = () => {
    setTimeout(() => setTriggerRefreshMsg(true), 10000);
  };

  return (
    <div className={`Loading`}>
      <p className='loading-text'>loading . . .</p>
      <img
        className='loading-defined-matchup'
        src={loading}
        alt='Loading Media Matchup'
        onLoad={() => loadingRefreshPrompt()}
      />
      {triggerRefreshMsg ? (
        <p className='loading-refresh'>( Try Refreshing )</p>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Loading;
