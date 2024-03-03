import { Item } from "../../models/item/Item";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box, Button, Card, CardBody, Container, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Heading,
    HStack, Stat, StatGroup, StatLabel, StatNumber, useBreakpointValue, useDisclosure
} from "@chakra-ui/react";
import {chunkArray} from "../../utils/array-utils";
import {CraftRequirement} from "../../models/item/CraftRequirement";
import {generateSkeletons} from "../ui/StackedSkeleton";
import {useLazyGetMaterialsByQuery} from "../../services/item";
import {useEffect, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import { Character } from "../../models/character/Character";
import { BuySellCard } from "./BuySellCard";

interface ItemDisplayProps {
    item: Item;
    owned?: number;
    onLabelClick?: (labelId: string) => void;
    character?: Character<any>
}

type Breakpoints = {
    labels: number
    materials: number
}

export const ItemDisplay = ({ item, owned, character, onLabelClick }: ItemDisplayProps) => {
    const size = useBreakpointValue<Breakpoints>({
        xl: { labels: 15, materials: 8 },
        lg: { labels: 10, materials: 7  },
        md: { labels: 5, materials: 5  },
        sm: { labels: 2, materials: 2 },
        base: { labels: 2, materials: 2 }
    }, {
        fallback: "md"
    })
    const [materialsBy, setMaterialsBy] = useState<string[] | null>(null)
    const [materialsIndex, setMaterialsIndex] = useState(0)
    const [trigger, result] = useLazyGetMaterialsByQuery()
    const {isOpen, onOpen, onClose} = useDisclosure()

    const openSourcePage = !!item.link
        ? () => { window.open(item.link!) }
        : undefined

    const onAccordionOpen = () => {
        if(!materialsBy) {
            trigger(item.name)
        }
    }

    useEffect(() => {
        if(!!result.data) {
            setMaterialsBy(result.data.ids)
        }
    }, [result])

    let labels = item.labels.length > 0
        ? chunkArray(item.labels.map(it => <Badge key={it.id} onClick={!!onLabelClick ? () => {onLabelClick(it.id)} : undefined}>{it.name}</Badge>), size?.labels ?? 5)
        : []

    if(labels.length > 2) {
        labels = labels.slice(0, 2)
        labels[1][labels[1].length - 1] = <Badge key="more" onClick={onOpen}>…</Badge>
    }

    const materials = !!materialsBy
        ? chunkArray(materialsBy, size?.materials ?? 2)
        : null

    return <>
        <Accordion allowToggle minWidth="100%">
        <AccordionItem onClick={onAccordionOpen}>
            <h2>
                <AccordionButton>
                    <AccordionIcon/>
                    <Box as="span" flex='1' textAlign='left' paddingLeft="0.5em" maxWidth="50%">
                        <h2>{item.name} {`${!!owned ? `(Owned: ${owned})` : ""}`}</h2>
                        {labels.length > 0 && labels.map( (lbs, id) =>
                            <HStack paddingTop="0.5em" key={id}>
                                {lbs}
                            </HStack>
                        )}
                    </Box>
                </AccordionButton>
            </h2>
            <AccordionPanel marginLeft="2em" marginRight="2em">
                <StatGroup>
                    <Stat>
                        <StatLabel>Usable</StatLabel>
                        <StatNumber>{item.usable ? "True" : "False"}</StatNumber>
                    </Stat>

                    <Stat>
                        <StatLabel>Attunement</StatLabel>
                        <StatNumber>{item.attunement ? "True" : "False"}</StatNumber>
                    </Stat>

                    <Stat
                        onClick={openSourcePage}
                        _hover={{cursor: !!openSourcePage ? "pointer" : undefined}}
                    >
                        <StatLabel>Source</StatLabel>
                        <StatNumber color={!!openSourcePage ? "#00B5D8" : undefined}>{item.manual}</StatNumber>
                    </Stat>
                </StatGroup>
                {!materials && <HStack>{generateSkeletons({quantity: size?.materials ?? 2, minWidth: "3vw", height: "3em"})}</HStack>}
                {!!materials && materials.length > 0 &&
                    <Container alignItems="left" minWidth="75%" paddingBottom="0.5em" marginLeft="0px" paddingLeft="0px" paddingTop="0.5em">
                        <Heading size="md">Can be used to craft:</Heading>
                        <HStack>
                            {materialsIndex > 0 && <Button onClick={() => setMaterialsIndex((index) => index > 0 ? index - 1 : index)}><ChevronLeftIcon /></Button>}
                            {materials[materialsIndex].map(it => <Card key={it} minWidth="8vw" >
                                <CardBody><Heading size="sm">{it}</Heading></CardBody>
                                </Card>)
                            }
                            {materialsIndex < (materials.length - 1) && <Button onClick={() => setMaterialsIndex((index) => index < (materials.length - 1) ? index + 1 : index)}><ChevronRightIcon /></Button>}
                        </HStack>
                    </Container>}
                <HStack paddingTop="1vh" spacing="2em" alignItems="baseline">
                    <BuySellCard requirements={item.buy} title="Buy" fallback="This item cannot be bought" item={item} />
                    <BuySellCard requirements={item.sell} title="Sell" fallback="This item cannot be sold" item={item} character={character}/>
                </HStack>
                {!!item.craft && item.craft?.length > 0 && chunkArray((item.craft ?? []), 3).map((it, id) =>
                    <HStack paddingTop="1vh" spacing="2em" alignItems="baseline" key={id}>
                        {it.map((itt, idd) => <CraftCard craftInfo={itt} index={id + idd + 1} key={id + idd + 1}/>)}
                    </HStack>
                )}
            </AccordionPanel>
        </AccordionItem>
    </Accordion>
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Labels of {item.name}</DrawerHeader>
            <DrawerBody>{item.labels.map(it => <Badge key={it.id} margin="0.5em" _hover={{ cursor: "pointer"}} onClick={!!onLabelClick ? () => {
                onLabelClick(it.id)
                onClose()
            } : undefined}>{it.name}</Badge>)}</DrawerBody>
        </DrawerContent>
    </Drawer>
    </>
}

interface CraftCardProps {
    craftInfo: CraftRequirement;
    index: number;
}

const CraftCard = ({craftInfo, index}: CraftCardProps) => {
    const chunkedMaterials = chunkArray(Object.entries({"MO": craftInfo.cost, ...craftInfo.materials}), 3)
    return <Card minWidth="32%">
        <CardBody>
            <Heading size="md" paddingBottom="0.5em">{craftInfo.label ?? `Recipe ${index}`}</Heading>
            <StatGroup>
                <Stat>
                    <StatLabel>Time Required</StatLabel>
                    <StatNumber>{craftInfo.timeRequired ?? "Instant."}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Min Quantity</StatLabel>
                    <StatNumber>{craftInfo.minQuantity ?? 1}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Max Quantity</StatLabel>
                    <StatNumber>{craftInfo.maxQuantity ?? 100}</StatNumber>
                </Stat>
            </StatGroup>
            {chunkedMaterials.length > 0 && chunkedMaterials.map((it, id) =>
                <StatGroup key={id}>
                    {it.map((itt, idd) =>
                        <Stat key={id + idd}>
                            <StatLabel>{itt[0]}</StatLabel>
                            <StatNumber>{itt[1]}</StatNumber>
                        </Stat>
                    )}
                </StatGroup>
            )}
            {craftInfo?.tools?.length > 0 && <Stat>
                <StatLabel>Requires Proficiencies</StatLabel>
                <StatNumber>{craftInfo?.tools?.join(", ")}</StatNumber>
            </Stat>}
            {craftInfo?.buildings?.length > 0 && <Stat>
                <StatLabel>Requires Buildings</StatLabel>
                <StatNumber>{craftInfo?.buildings?.join(", ")}</StatNumber>
            </Stat>}
        </CardBody>
    </Card>
}