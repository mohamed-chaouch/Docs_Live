import Image from "next/image";
import { Button } from "./ui/button";

interface INavBar {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavBar = ({
  setOpen,
}: INavBar) => {
  return (
    <div className="flex items-center justify-between px-2 sm:px-12 my-2">
      <div className="flex items-center">
        <Image src="/icons/note.svg" alt="Note" width={50} height={50} />
        <p className="text-xl font-bold text-black">Live Docs</p>
      </div>
      <div>
        <Button className="bg-yellow-1 hover:bg-yellow-2 px-4 sm:px-8 rounded-[20px] text-black font-bold shadow-2xl" onClick={()=>{
          setOpen(true);
        }}>Sign-Up For Free</Button>
      </div>
    </div>
  );
};

export default NavBar;
