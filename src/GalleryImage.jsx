import { Button, ButtonGroup } from "@chakra-ui/react"
import { useDisclosure, useOutsideClick } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, HStack, Link, Spacer } from "@chakra-ui/layout";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { motion } from 'framer-motion'

const MotionImage = motion(Image)

export function GalleryImage({ src, srcLarge, image } = {}) {
    const [isLoading, setIsLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const contentRef = useRef()
    useOutsideClick({
        ref: contentRef,
        handler: onClose
    })

    return (
        <>
            <MotionImage
                onClick={onOpen}
                cursor="pointer"
                borderRadius="md"
                width="100%"
                src={src}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
            ></MotionImage>

            <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered allowPinchZoom>
                <ModalOverlay onClick={onClose} />
                {isLoading &&
                    <ModalContent boxShadow={null} background="whiteAlpha.0" alignItems="center" justifyContent="center">
                        <Spinner color="white" thickness="4px" size="lg" />
                    </ModalContent>
                }
                <ModalContent display={isLoading ? "none" : "inherit"} background="whiteAlpha.0" boxShadow={null} alignItems="center" justifyContent="center" >
                    <Box ref={contentRef} alignItems="center">
                        <Link href={image.representations.full} isExternal>
                            <Image
                                maxHeight="100vh"
                                maxWidth="100vw"
                                borderRadius="xl"
                                src={srcLarge}
                                onLoad={() => setIsLoading(false)}
                            ></Image>
                        </Link>
                        <Box p="3" my="3" backgroundColor="white" borderRadius="xl" justifyItems="space-between">
                            <HStack>
                                <ButtonGroup>
                                    {image.source_url &&
                                        <Link style={{ textDecoration: 'none' }} href={image.source_url} isExternal>
                                            <Button colorScheme="blue">Original Source</Button>
                                        </Link>
                                    }
                                    <Link style={{ textDecoration: 'none' }} href={`https://derpibooru.org/images/${image.id}`} isExternal>
                                        <Button colorScheme="blue">View on Derpibooru</Button>
                                    </Link>
                                </ButtonGroup>
                                <Spacer></Spacer>
                                <Button>Close</Button>
                            </HStack>
                        </Box>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    )
}