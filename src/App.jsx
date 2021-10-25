import { useEffect, useState } from "react"
import { Box, Container, Heading, HStack, Spacer } from "@chakra-ui/layout"
import axios from "axios"
import Gallery from "./Gallery"
import { Loader } from "./Loader"
import { Text } from "@chakra-ui/react"

async function getAllImages() {
    let imageResponses = []
    let res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,screencap,-edited%20screencap,solo,safe,-korean,-anthro&per_page=1&page=1')
    for (let i = 0; i < res.data.total; i += 50) {
        const page = i / 50 + 1
        res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,screencap,-edited%20screencap,solo,safe,-korean,-anthro&sf=random&per_page=50&page=' + page)
        imageResponses = [...imageResponses, ...res.data.images]
    }
    return imageResponses.filter((image) => {
        return image.format !== "webm"
    })
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
            {images.length &&
                <HStack mt="6" align="center">
                    <Heading color="#DD64A1">Izzy Pics</Heading>
                    <Spacer></Spacer>
                    <Text color="blackAlpha.700" fontSize="lg">Showing {images.length} Izzy pics</Text>
                </HStack>
            }
            <Box my="6">
                <Gallery images={images} delay={100}></Gallery>
            </Box>
            {loading &&
                <Loader></Loader>
            }
        </Container>
    )
}

export default App
