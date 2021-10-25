import { Heading, HStack, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

const izzyQuotes = [
    "A glow-up? Honey, you came to the right cottage...",
    "Now that's what I call a glow-up!",
    "Hi, new friend! My name's Izzy!",
    "Do Earth Ponies also like staring contests?",
    "I will need a box of macaroni, a tube of glue, fourteen gooey bunnies, and three jelly beans. Oh. And glitter. Lots of glitter.",
    "We're all in this together, right?",
    "I see you!",
    "I know what you're thinking..."
]

export function Loader() {
    return (
        <VStack justify="center" height="90vh" overflow="hidden">
            <HStack align="center">
                <VStack spacing="30px">
                    <Heading size="lg" textAlign="center" color="#DD64A1">{izzyQuotes[Math.floor(Math.random() * izzyQuotes.length)]}</Heading>
                    <Spinner color="#DD64A1" thickness="3px" size="lg" />
                </VStack>
            </HStack>
        </VStack>
    )
}