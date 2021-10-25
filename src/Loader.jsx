import { Heading, HStack, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

export function Loader() {
    return (
        <VStack justify="center" height="100vh">
            <HStack align="center">
                <VStack spacing="30px">
                    <Heading size="lg" textAlign="center" color="#DD64A1">Loading Izzy from Derpibooru</Heading>
                    <Spinner color="#DD64A1" thickness="3px" size="lg" />
                </VStack>
            </HStack>
        </VStack>
    )
}