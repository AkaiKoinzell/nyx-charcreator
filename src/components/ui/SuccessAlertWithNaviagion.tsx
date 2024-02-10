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

type SuccessAlertWithNavigationProps = {
    show: boolean;
    navigateTo?: string;
    description?: string;
};
export const SuccessAlertWithNavigation = ({
    show,
    navigateTo,
    description,
}: SuccessAlertWithNavigationProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            onOpen();
        }
    }, [show, onOpen]);

    const goToPage = () => {
        onClose();
        if (!!navigateTo) {
            navigate(navigateTo);
        }
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
                    <Alert status="success">
                        <AlertIcon />
                        {description ?? "Operation completed successfully"}
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={goToPage}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
