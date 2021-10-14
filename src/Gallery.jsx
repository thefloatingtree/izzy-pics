import { Image } from "@chakra-ui/image";
import { HStack, VStack } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useScrolledToBottom } from "./hooks/useScrolledToBottom";
import { useWindowSize } from "./hooks/useWindowSize";

const MotionImage = motion(Image)

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

export default function Gallery({ images, delay = 150, numberOfImagesToLoad = 24 } = {}) {
    const [displayedImages, setDisplayedImages] = useState([])
    const [columns, setColumns] = useState([])
    const [columnCount, setColumnCount] = useState(1)
    const [lastImageIndex, setLastImageIndex] = useState(0)
    const [shouldDelay, setShouldDelay] = useState(true)

    const { width } = useWindowSize()
    const isBottom = useScrolledToBottom(500)

    // Get new section of images to display
    const getNewImages = () => {
        const temp = images.slice(lastImageIndex, lastImageIndex + numberOfImagesToLoad)
        if (temp.length) setLastImageIndex(lastImageIndex + temp.length)
        return temp
    }

    // Load set of images on component mount
    useEffect(() => {
        setDisplayedImages([...displayedImages, ...getNewImages()])
    }, [images])
    
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

    // Update column count
    useEffect(() => {
        [
            { test: (w) => w < 768, columns: 1 },
            { test: (w) => w >= 768 && w < 992, columns: 2 },
            { test: (w) => w >= 992 && w < 1280, columns: 3 },
            { test: (w) => w >= 1280, columns: 4 }
        ].forEach(({ test, columns }) => {
            if (test(width)) setColumnCount(columns)
        })
    }, [width])

    // Reflow columns when images are added or column count changes
    useEffect(() => {
        if (!columnCount) return
        console.log("REFLOW")
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
                            const delayIndex = shouldDelay ? ((columnIndex + columnCount * imageIndex) - lastImageIndex + numberOfImagesToLoad) : 0
                            return (
                                <MotionImage
                                    transition={{ delay: (delay / 1000) * delayIndex }}
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