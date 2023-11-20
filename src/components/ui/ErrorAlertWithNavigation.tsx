import {
    Alert,
    AlertIcon,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type ErrorAlertWithNavigationProps = {
    show: boolean;
    navigateTo: string;
};
export const ErrorAlertWithNavigation = ({
    show,
    navigateTo,
}: ErrorAlertWithNavigationProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            onOpen();
        }
    }, [show, onOpen]);

    const goToPage = () => {
        navigate(navigateTo);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnEsc={false}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Alert status="error">
                        <AlertIcon />
                        An error occurred, please try again later
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={goToPage}>
                        Go Back
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
