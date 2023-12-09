import HomeIcon from "@assets/home.svg?react";
import SearchIcon from "@assets/search.svg?react";
import Playlists, { type Props } from "@components/Playlists";

export default function Menu(props: Props) {
  return (
    <nav className="flex flex-col space-y-2">
      {/* Page */}
      <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-background-light">
        <ul className="space-y-2">
          <li>
            <button className="py-2">
              <HomeIcon className="text-zinc-400 hover:text-white" width={24} height={24} />
            </button>
          </li>
          <li>
            <button className="py-2">
              <SearchIcon className="text-zinc-400 hover:text-white" width={24} height={24} />
            </button>
          </li>
        </ul>
      </div>
      <Playlists {...props} />
    </nav>
  );
}
