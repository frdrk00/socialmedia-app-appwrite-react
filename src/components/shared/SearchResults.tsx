import { Models } from 'appwrite'

import { Loader } from '@/components/shared/Loader'
import { GridPostList } from '@/components/shared/GridPostList'

type SearchResultsProps = {
  isSearchFetching: boolean
  searchedPosts: Models.Document[]
}

export const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultsProps) => {
  if (isSearchFetching) return <Loader />
  // @ts-ignore
  if (searchedPosts && searchedPosts.documents.length > 0) {
    // @ts-ignore
    return <GridPostList posts={searchedPosts.documents} />
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}
