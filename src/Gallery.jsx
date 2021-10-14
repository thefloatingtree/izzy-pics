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

// Normalize image height to a width of 100
const normalizeHeight = (width, height) => {
    return (height / width) * 100 // 100 is arbitrary
}

const reflowColumns = (images, columnCount, columnHeights) => {
    // Build 2D array with columnCount many columns
    const columnOutput = Array.from(Array(columnCount), () => [])
    // Iterate over each image and decide which column it should be placed in
    images.forEach((image) => {
        // Make sure each image is scaled to the same width
        const normalizedHeight = normalizeHeight(image.width, image.height)
        // Attempt to place the image in each column. Sum the distance between each column and its neighboors, return list of distances
        const potentialColumnDistances = columnHeights.map((height, index) => {
                const newHeight = height + normalizedHeight
                const distance = columnHeights.reduce((acc, _height, _index) => {
                    if (index === _index) return acc
                    return acc + Math.abs(_height - newHeight)
                }, newHeight)
                return distance
            })
        // Choose the minimum distance
        const columnIndex = potentialColumnDistances.indexOf(Math.min(...potentialColumnDistances))
        columnOutput[columnIndex].push(image)
        columnHeights[columnIndex] += normalizedHeight
    })
    return columnOutput
}

const MotionImage = motion(Image);
const NumberOfImagesToLoad = 25

export default function Gallery({ images, delay = 150 } = {}) {
    const [displayedImages, setDisplayedImages] = useState([])
    const [columns, setColumns] = useState([])
    const [lastImageIndex, setLastImageIndex] = useState(0)
    const [shouldDelay, setShouldDelay] = useState(true)

    const columnCount = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 3, xl: 4 })
    const isBottom = useScrolledToBottom(500)

    const getNewImages = () => {
        const temp = images.slice(lastImageIndex, lastImageIndex + NumberOfImagesToLoad)
        if (temp.length) setLastImageIndex(lastImageIndex + temp.length)
        return temp
    }

    // Load set of images on component mount
    useEffect(() => {
        setDisplayedImages([...displayedImages, ...getNewImages()])
    }, [])

    // Load more images when we scroll to the bottom
    useEffect(() => {
        if (isBottom) {
            // Only set new images if there are actually new images
            const newImages = getNewImages()
            if (!newImages.length) return
            setDisplayedImages([...displayedImages, ...newImages])
            setShouldDelay(false)
        }
    }, [isBottom])

    // Reflow columns when images are added or column count changes
    useEffect(() => {
        if (!columnCount) return
        // Reflow from scratch
        const columnHeights = new Array(columnCount).fill(0)
        setColumns(reflowColumns(displayedImages, columnCount, columnHeights))
    }, [displayedImages, columnCount])

    return (
        <HStack align="start">
            {columns.map((column, columnIndex) => {
                return (
                    <VStack key={columnIndex} width="100%">
                        {column.map((image, imageIndex) => {
                            const delayIndex = shouldDelay ? ((columnIndex + columnCount * imageIndex) - lastImageIndex + NumberOfImagesToLoad) : 0
                            return (
                                <MotionImage
                                    transition={{ delay: (delay / 1000) * delayIndex }}
                                    variants={{ start: { opacity: 0 }, end: { opacity: 1 } }}
                                    initial="start"
                                    animate="end"
                                    borderRadius="md"
                                    width="100%"
                                    src={image.representations.medium}
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