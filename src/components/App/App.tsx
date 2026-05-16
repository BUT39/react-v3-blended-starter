import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });
  const totalPage = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;
  const posts = data?.posts || [];
  const hendleSearch = useDebouncedCallback(query=>{setSearchQuery(query); setCurrentPage(1)}, 1000);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox  onSearch={hendleSearch}/>
        {totalPage>1&&<Pagination totalPages={totalPage} currentPage={currentPage} onPageChange={setCurrentPage} />}
        
        <button className={css.button}>Create post</button>
      </header>
      {posts.length>0&&<PostList posts={posts} />}
    </div>
  );
}
