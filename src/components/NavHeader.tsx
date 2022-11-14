import "./styles/NavHeader.css";

interface Props {
  currentDisplay: string;
}

const NavHeader = ({ currentDisplay }: Props) => {
  return (
    <div className='NavHeader'>
      <p>{currentDisplay}</p>
    </div>
  );
};

export default NavHeader;
