import { useEffect, useState } from "react"
import { Box, Container } from "@chakra-ui/layout"
import axios from "axios"
import Gallery from "./Gallery"
import { Loader } from "./Loader"

async function getAllImages() {
    let imageResponses = []
    let res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&per_page=1&page=1')
    for (let i = 0; i < res.data.total; i += 50) {
        const page = i / 50 + 1
        res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&sf=random&per_page=50&page=' + page)
        imageResponses = [...imageResponses, ...res.data.images]
    }
    return imageResponses
}

function App() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchImages = () => {
        setLoading(true)
        getAllImages()
            .then(images => {
                setImages(images)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchImages()
    }, [])

    return (
        <Container maxW="container.xl">
            <Box mt="6">
                <Gallery images={images} delay={100}></Gallery>
            </Box>
            {loading &&
                <Loader></Loader>
            }
        </Container>
    )
}

export default App
