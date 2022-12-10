import "./styles/NavCommunity.css";
import { useState } from "react";
import { Matchup } from "../models/Matchup";

const NavCommunity = () => {
  const [daily1, setDaily1] = useState<Matchup[]>();
  const [daily2, setDaily2] = useState<Matchup[]>();
  const [daily3, setDaily3] = useState<Matchup[]>();
  const [daily4, setDaily4] = useState<Matchup[]>();
  const [daily5, setDaily5] = useState<Matchup[]>();
  const [daily6, setDaily6] = useState<Matchup[]>();
  const [daily7, setDaily7] = useState<Matchup[]>();
  const [daily8, setDaily8] = useState<Matchup[]>();
  const [daily9, setDaily9] = useState<Matchup[]>();
  const [daily10, setDaily10] = useState<Matchup[]>();

  let bgImgURL =
    "https://apollo.imgix.net/content/uploads/2018/02/LEADPablo-Picasso-Femme-au-beret-et-a-la-robe-quadrillee-Marie-Therese-Walter-December-1937.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&w=900&h=600";

  return (
    <div className='NavCommunity'>
      <img className='bg-img' src={bgImgURL} alt='Winner: College Dropout' />
      <div className='daily-stats'>
        <ul className='daily-list'>
          <li>
            <p className='todays-winner'>Community Tab Coming Soon!</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavCommunity;
