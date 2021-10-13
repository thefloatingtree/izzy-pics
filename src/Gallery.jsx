import { Image } from "@chakra-ui/image";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useScrollYPosition } from 'react-use-scroll-position'

function useScrolledToBottom(offset = 0) {
    const scrollY = useScrollYPosition()
    return Boolean(window.innerHeight + scrollY + offset >= document.body.offsetHeight && document.body.offsetHeight)
}

const MotionImage = motion(Image);

export default function Gallery({ getNewImages = () => [], delay = 150 } = {}) {
    const [images, setImages] = useState([])
    const [columns, setColumns] = useState([])

    const columnCount = useBreakpointValue({ sm: 1, md: 2, lg: 3, xl: 4 })

    const isBottom = useScrolledToBottom(500)

    useEffect(() => {
        setImages([...images, ...getNewImages()])
    }, [])

    useEffect(() => {
        const columnOutput = Array.from(Array(columnCount), () => [])
        const columnHeights = new Array(columnCount).fill(0)

        images.forEach((image) => {
            const columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
            columnOutput[columnIndex].push(image)
            columnHeights[columnIndex] += image.height
        })

        setColumns(columnOutput)
    }, [columnCount, images])

    useEffect(() => {
        if (isBottom) setImages([...images, ...getNewImages()])
    }, [isBottom])

    // bit of a hack, but it works!
    let counter = -1

    return (
        <HStack align="start">
            {columns.map((column, columnIndex) => {
                return (
                    <VStack key={columnIndex} width="100%">
                        {column.map((image, imageIndex) => {
                            counter += 1
                            return (
                                <MotionImage
                                    transition={{ delay: (delay / 1000) * (counter % columnIndex) }}
                                    variants={{ start: { opacity: 0 }, end: { opacity: 1 } }}
                                    initial="start"
                                    animate="end"
                                    borderRadius="md"
                                    width="100%"
                                    src={image.representations.small}
                                    key={imageIndex}
                                ></MotionImage>
                            )
                        })}
                    </VStack>
                )
            })}

        </HStack>
    )
}