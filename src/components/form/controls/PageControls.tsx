import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, HStack, Icon } from "@chakra-ui/react"
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface PageControlsProps {
    pageSize: number;
    totalCount: number;
    onPageChange: (newPage: number, totalPages: number) => void;
}

export const PageControls = ({ pageSize, totalCount, onPageChange }: PageControlsProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalCount/pageSize);

    const nextPage = () => {
        onPageChange(currentPage+1, totalPages);
        setCurrentPage((page: number) => page+1);
    }

    const previousPage = () => {
        onPageChange(currentPage-1, totalPages);
        setCurrentPage((page: number) => page-1);
    }

    return <>
        {pageSize < totalCount && <HStack>
            {currentPage > 1 && <Button onClick={previousPage}><ChevronLeftIcon /></Button>}
            {currentPage >= 3 && <Button isDisabled={true} _hover={{ cursor: "default"}} ><Icon as={HiOutlineDotsHorizontal} /></Button>}
            {currentPage >= 2 && <Button onClick={previousPage}>{currentPage-1}</Button>}
            <Button colorScheme='teal'>{currentPage}</Button>
            {currentPage <= (totalPages-1) && <Button onClick={nextPage}>{currentPage+1}</Button>}
            {currentPage <= (totalPages-2) && <Button isDisabled={true} _hover={{ cursor: "default"}}><Icon as={HiOutlineDotsHorizontal} /></Button>}
            {currentPage < totalPages && <Button onClick={nextPage}><ChevronRightIcon /></Button>}
        </HStack>}
    </>
}