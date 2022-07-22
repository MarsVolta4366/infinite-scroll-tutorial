import axios from "axios"
import { useEffect, useState } from "react"

const useBookSearch = (query, pageNumber) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)

    // Reset books array on new search
    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        let cancel
        setLoading(true)
        setError(false)

        const fetchData = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: "http://openlibrary.org/search.json",
                    params: { q: query, page: pageNumber },
                    cancelToken: new axios.CancelToken(c => cancel = c)
                })
                setBooks(prevBooks => {
                    // Using a Set to remove duplicates
                    return [...new Set([...prevBooks, ...response.data.docs.map(b => b.title)])]
                })
                setHasMore(response.data.docs.length > 0)
                setLoading(false)
                console.log(response.data)
            } catch (e) {
                if (axios.isCancel(e)) {
                    return
                } else {
                    setError(true)
                }
            }
        }
        fetchData()

        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, books, hasMore }
}

export default useBookSearch