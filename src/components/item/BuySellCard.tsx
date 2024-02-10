import { Button, Card, CardBody, HStack, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatLabel, StatNumber, useDisclosure } from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import { BuySellRequirement } from "../../models/item/BuySellRequirement";
import { Item, characterCanSell } from "../../models/item/Item";
import { NumberInput } from "../form/controls/NumberInput";
import { useState } from "react";
import { LoadingModal } from "../ui/LoadingModal";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { ErrorAlertWithNavigation } from "../ui/ErrorAlertWithNavigation";
import { SuccessAlertWithNavigation } from "../ui/SuccessAlertWithNaviagion";
import { useUpdateInventoryMutation } from "../../services/character";
import { UpdateInventoryOperation } from "../../models/character/UpdateInventoryDto";

interface BuySellCardProps {
    item: Item;
    requirements: BuySellRequirement | null | undefined;
    title: string;
    fallback: string;
    character?: Character<any>
}

export const BuySellCard = ({requirements, title, fallback, character, item}: BuySellCardProps) => {
    const [userSellQty, setUserSellQty] = useState(1)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [updateInventory, { status, error }] = useUpdateInventoryMutation()
    const sellQty = !!character ? characterCanSell(character, item) : 0
    return <>
        <LoadingModal
            show={status === QueryStatus.pending}
            title="Selling item..."
        />
        <ErrorAlertWithNavigation
            show={status === QueryStatus.rejected}
            description={JSON.stringify(error)}
        />
        <SuccessAlertWithNavigation
            show={status === QueryStatus.fulfilled}
            navigateTo={`/user/${character?.id}`}
        />
        <Card minWidth="35%">
        <CardBody>
            <Heading size="md" paddingBottom="0.5em">{title}</Heading>
            {!requirements && <Heading size="sm">{fallback}</Heading>}
            {sellQty > 0 && <>
                <Stat>
                    <StatLabel>Price</StatLabel>
                    <StatNumber>{(requirements?.cost ?? 0) * (userSellQty > 0 ? userSellQty : 1)} MO</StatNumber>
                </Stat>
                <HStack>
                    <NumberInput 
                        label="" max={sellQty} min={1} formMarginLeft="0"
                        validator={it => !!it && it > 0 && it <= sellQty}
                        valueConsumer={it => {
                            if(it.isValid && !!it.value) {
                                setUserSellQty(it.value)
                            }
                        }}
                    />
                    <Button colorScheme='teal' onClick={onOpen}>Sell</Button>
                </HStack>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Sell item</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <p>Do you want to sell {userSellQty} {item.name}?</p>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={() => {
                                if(!!character && userSellQty > 0) {
                                    updateInventory({
                                        characterId: character?.id ?? "", 
                                        itemId: item.name, 
                                        qty: userSellQty, 
                                        operation: UpdateInventoryOperation.SELL
                                    })
                                }
                                onClose()
                            }}>Sell</Button>
                            <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>}
            {!!requirements && sellQty <= 0 && <>
                <Stat>
                    <StatLabel>Price</StatLabel>
                    <StatNumber>{requirements?.cost ?? 0} MO</StatNumber>
                </Stat>
                {requirements?.tools?.length > 0 && <Stat>
                    <StatLabel>Requires Proficiencies</StatLabel>
                    <StatNumber>{requirements?.tools?.join(", ")}</StatNumber>
                </Stat>}
                {requirements?.buildings?.length > 0 && <Stat>
                    <StatLabel>Requires Buildings</StatLabel>
                    <StatNumber>{requirements?.buildings?.join(", ")}</StatNumber>
                </Stat>}
            </>}

        </CardBody>
    </Card></>
}