import {
    Center,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

export type LoadingModalProps = {
    show: boolean, 
    title: String;
};

export const LoadingModal = ({ show, title }: LoadingModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (show) {
            onOpen();
        } else {
            onClose();
        }
    }, [show, onOpen, onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnEsc={false}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                </ModalBody>
            </ModalContent>
            <ModalFooter></ModalFooter>
        </Modal>
    );
};
