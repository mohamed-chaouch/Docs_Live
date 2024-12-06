"use client";

import AddNewDocument from "@/components/AddNewDocument";
import ListDocuments from "@/components/ListDocuments";
import NavBar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import useUserInfo from "@/hooks/useUserInfo";
import api from "@/utils/axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { Room as LiveblocksRoom } from "@liveblocks/client";
import Loader from "@/components/Loader";
interface Room extends LiveblocksRoom {
  metadata: RoomMetadata;
  usersAccesses: RoomAccesses;
  createdAt: string;
}
const Home = () => {
  const { user } = useUserInfo();
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limitPages = page === 1 ? 8 : 9;
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update the debounced value after delay
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const onPageChange = async (action: string | number) => {
    let pageValue: number;

    if (action === "next") {
      pageValue = Math.min(Number(page) + 1, totalPages);
    } else if (action === "prev") {
      pageValue = Math.max(Number(page) - 1, 1);
    } else if (typeof action === "number") {
      pageValue = Math.min(Math.max(action, 1), totalPages);
    } else {
      pageValue = Number(page);
    }

    setPage(pageValue);
  };

  const [documents, setDocuments] = useState<Room[]>([]);

  useEffect(() => {
    const handleDocuments = async () => {
      if (!user || !cookies?.accessToken) {
        router.push("/");
      }

      try {
        setLoading(true);

        const response = await api.get(
          `document/get-documents-by-user/${user?.email}?limit=${limitPages}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${cookies?.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        setDocuments(response.data.rooms);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    handleDocuments();
  }, [page, cookies.accessToken, user, limitPages]);

  const [filteredDocuments, setFilteredDocuments] = useState<Room[]>([]);

  useEffect(() => {
    if(documents.length > 0){
      const filtered = documents.filter((document) =>
        document.metadata.title
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
      setTotalPages(Math.ceil(filtered.length / Number(limitPages)));
    }else {
      setFilteredDocuments([]);
      setTotalPages(1);
    }
  }, [debouncedQuery, documents]);

  console.log(documents,": documentssssssss")
  // Include an "Add Document" card on the first page
  const displayedDocuments =
    page === 1 ? [<AddNewDocument key="add-card" />] : [];
  const paginatedDocuments = filteredDocuments.slice(
    (page - 1) * limitPages,
    page * limitPages
  );


  return (
    <div className="sm:h-[calc(100vh-8px)] relative">
      <NavBar listDoc={true} />
      <div className="block md:flex items-center justify-between px-6 md:px-24 my-6">
        <h1 className="text-3xl font-bold text-orange-1">List of Documents</h1>
        <div className="relative w-full md:w-[350px] mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search"
            className="py-2 pl-4 pr-12 rounded-[10px] text-white bg-black w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute top-2 right-2 text-white">
            <Search />
          </span>
        </div>
      </div>
      {loading ? (
        <Loader className="h-[500px]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-6 md:px-24 gap-y-8 md:gap-x-12 xl:gap-x-24">
          {displayedDocuments}
          <ListDocuments documents={paginatedDocuments} setDocuments={setDocuments} page={page} />
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="sm:absolute sm:bottom-6 sm:right-2 my-6 sm:my-0">
          <PaginationContent className="flex items-center justify-end w-full pr-3 md:pr-16">
            <Button
              className="w-8 h-8 rounded-full bg-yellow-1 hover:bg-orange-1"
              disabled={Number(page) <= 1}
              onClick={() => onPageChange("prev")}
            >
              <ChevronLeft />
            </Button>

            <div className="flex items-center justify-center px-2 md:px-8">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value, 10);
                  if (!isNaN(newPage)) {
                    setPage(newPage);
                  }
                }}
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement; // Typecast to HTMLInputElement
                  const newPage = parseInt(target.value, 10);
                  if (!isNaN(newPage)) {
                    onPageChange(newPage);
                  }
                }}
                className="w-16 text-center border border-gray-300 rounded-md"
              />
              <span className="ml-2">/ {totalPages}</span>
            </div>

            <Button
              className="w-8 h-8 rounded-full bg-yellow-1 hover:bg-orange-1"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <ChevronRight />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
export default Home;
