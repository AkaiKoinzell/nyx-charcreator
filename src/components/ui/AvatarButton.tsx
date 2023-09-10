import { HamburgerIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import "../../css/components/ui/AvatarButton.css"

export const AvatarButton = ({ onClick }: { onClick: () => void}) => {
    return (
        <Button colorScheme='gray' onClick={onClick} className="avatar-btn">
            <HamburgerIcon />
        </Button>
    );
};
