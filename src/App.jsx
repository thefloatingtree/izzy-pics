import { Button } from "@chakra-ui/button"
import { Container, VStack } from "@chakra-ui/layout"
import axios from "axios"
import { useState } from "react"
import Gallery from "./Gallery"

async function getAllImages() {
    let imageResponses = []
    let res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&per_page=1&page=1')
    for (let i = 0; i < res.data.total - 100; i += 50) {
        const page = i / 50 + 1
        console.log(page)
        res = await axios.get('https://derpibooru.org/api/v1/json/search/images?q=izzy%20moonbow,%20screencap,%20-animated,%20-edited%20screencap,%20solo,%20safe,%20-korean&per_page=50&page=' + page)
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

    return (
        <Container maxW="container.xl">
            <VStack align="start" my="6" spacing="15px">
                <Button isLoading={loading} colorScheme="blue" onClick={() => fetchImages()}>Get Izzy</Button>
                {!!images.length &&
                    <Gallery getNewImages={() => images}></Gallery>
                }
            </VStack>
        </Container>
    )
}

export default App
