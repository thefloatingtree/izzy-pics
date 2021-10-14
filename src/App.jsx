import { Button } from "@chakra-ui/button"
import { Box, Center, Container, Heading, HStack, VStack } from "@chakra-ui/layout"
import { Spinner } from "@chakra-ui/spinner"
import { Fade } from "@chakra-ui/transition"
import axios from "axios"
import { useEffect, useState } from "react"
import Gallery from "./Gallery"

async function getAllImages() {
    let imageResponses = []
    let res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&per_page=1&page=1')
    for (let i = 0; i < res.data.total; i += 50) {
        const page = i / 50 + 1
        console.log(page)
        res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&sf=random&per_page=50&page=' + page)
        imageResponses = [...imageResponses, ...res.data.images]
    }
    return imageResponses
}

function App() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

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
            <VStack align="start" my="6" spacing="15px">
                {!loading &&
                    <Gallery images={images} delay={100}></Gallery>
                }
            </VStack>
            {loading &&
                <Fade in={loading}>
                    <VStack align="center" justify="center" height="100vh">
                        <HStack align="center">
                            <VStack spacing="30px">
                                <Heading textAlign="center" color="blue.500">Loading Izzy from Derpibooru</Heading>
                                <Spinner color="blue.500" thickness="4px" size="xl"></Spinner>
                            </VStack>
                        </HStack>
                    </VStack>
                </Fade>
                }
        </Container>
    )
}

export default App
