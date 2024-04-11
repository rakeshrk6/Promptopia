"use client"

import { useEffect, useState } from "react"
import PromptCard from "./PromptCard"
import Image from "next/image"
import { connectToDB } from "@utils/database"
import Loading from "./loading"

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("")
  const [allPosts, setAllPosts] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    connectToDB()
  }, [])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchedResults(searchResult)
      }, 500)
    )
  }

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i") // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompts(tagName)
    setSearchedResults(searchResult)
  }

  useEffect(() => {
    try {
      setLoading(true)
      const fetchPosts = async () => {
        const response = await fetch("/api/prompt")
        const data = await response.json()
        setAllPosts(data)
      }

      fetchPosts()
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }, [])

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
        {searchText && (
          <Image
            alt="clear_icon"
            src="/assets/icons/cross2.svg"
            width={25}
            height={25}
            className="absolute right-2 cursor-pointer"
            onClick={() => setSearchText("")}
          />
        )}
      </form>

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : loading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed
