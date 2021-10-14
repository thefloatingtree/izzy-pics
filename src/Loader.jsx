import { Heading, HStack, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

export function Loader() {
    return (
        <VStack justify="center" height="100vh">
            <HStack align="center">
                <VStack spacing="30px">
                    <Heading textAlign="center" color="blue.500">Loading Izzy from Derpibooru</Heading>
                    <Spinner color="blue.500" thickness="4px" size="xl" />
                </VStack>
            </HStack>
        </VStack>
    )
}