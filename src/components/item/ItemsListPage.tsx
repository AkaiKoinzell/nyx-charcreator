import {useGetLabelsQuery} from "../../services/label";
import React, {useState} from "react";
import {Item} from "../../models/item/Item";
import {StackedSkeleton} from "../ui/StackedSkeleton";
import {
    Alert,
    AlertIcon,
    CloseButton,
    Container,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Skeleton, Stack,
    VStack,
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {ItemDisplay} from "./ItemDisplay";
import { Character } from "../../models/character/Character";

interface ItemsListPageProps {
    items?: Item[] | undefined;
    owned?: { [key: string]: number};
    character?: Character<any>;
}

export const ItemsListPage = ({ items, owned, character }: ItemsListPageProps) => {
    const { data: loadedLabels, error: labelsError } = useGetLabelsQuery({});
    const [labelFilter, setLabelFilter] = useState<string | null>(null)
    const [searchFilter, setSearchFilter] = useState<string | null>(null)

    const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.selectedOptions[0]?.id;
        if(!!selectedId) {
            setLabelFilter(selectedId);
        }

     }

    const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.trim().length > 0) {
            setSearchFilter(e.target.value.trim().toLowerCase())
        } else {
            setSearchFilter(null)
        }
    }

    return (<>
        {!items && <StackedSkeleton quantity={5} height="5vh"/>}
        {!!items && <VStack alignItems="left">
            <Stack direction={{base: "column", sm: "row"}}>
                {!loadedLabels && !labelsError && <Container minWidth="10vw"><Skeleton height="4vh"/></Container>}
                {!!labelsError && <Alert status="error" height="4.5vh"><AlertIcon />Cannot load labels</Alert>}
                {!!loadedLabels && !labelFilter && <Select placeholder="Filter by label" onChange={onSelectChange}>
                    {[...loadedLabels].sort((a,b) => a.name.localeCompare(b.name)).map(it => <option key={it.id} id={it.id}>{it.name}</option>)}
                </Select>}
                {!!loadedLabels && !!labelFilter && <Alert status="success" height="4.5vh"><CloseButton
                    position='relative'
                    left={-2}
                    onClick={() => {setLabelFilter(null)}}
                />{loadedLabels.find(it => it.id === labelFilter)?.name}</Alert>}
                <InputGroup>
                    <InputLeftAddon><SearchIcon /></InputLeftAddon>
                    <Input placeholder="Search" minWidth="75vw" onChange={onChangeFilter}/>
                </InputGroup>
            </Stack>
            {items.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
                .filter(it => !labelFilter || (!!labelFilter && it.labels.find(l => l.id === labelFilter)))
                .filter(it => !searchFilter || (!!searchFilter && it.name.toLowerCase().includes(searchFilter)))
                .map(it => <ItemDisplay
                    key={it.name}
                    item={it}
                    owned={!!owned ? owned[it.name] : undefined}
                    onLabelClick={id => setLabelFilter(id)} character={character}
                    showControls={false}
                    onMouseEnter={() => {}}
                    controlsOnEdit={() => {}}
                />)
            }
        </VStack>}
    </>)
}