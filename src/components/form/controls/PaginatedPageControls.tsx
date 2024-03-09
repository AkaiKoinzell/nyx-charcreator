import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, HStack, Icon } from "@chakra-ui/react"
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface PaginatedPageControlsProps {
    hasNext: boolean;
    currentPage: number;
    increasePage: () => void;
    decreasePage: () => void;
    onNextEnter?: () => void;
}

export const PaginatedPageControls = ({ hasNext, currentPage, increasePage, decreasePage, onNextEnter }: PaginatedPageControlsProps) => {
    const nextPage = () => {
        increasePage();
    }

    const previousPage = () => {
        decreasePage();
    }

    return <>
        {(hasNext || currentPage > 1) && <HStack>
            {currentPage > 1 && <Button onClick={previousPage}><ChevronLeftIcon /></Button>}
            {currentPage >= 3 && <Button isDisabled={true} _hover={{ cursor: "default"}} ><Icon as={HiOutlineDotsHorizontal} /></Button>}
            {currentPage >= 2 && <Button onClick={previousPage}>{currentPage-1}</Button>}
            <Button colorScheme='teal'>{currentPage}</Button>
            {hasNext && <Button onClick={nextPage} onMouseEnter={onNextEnter}>{currentPage+1}</Button>}
            {hasNext && <Button isDisabled={true} _hover={{ cursor: "default"}}><Icon as={HiOutlineDotsHorizontal} /></Button>}
            {hasNext && <Button onClick={nextPage} onMouseEnter={onNextEnter}><ChevronRightIcon /></Button>}
        </HStack>}
    </>
}