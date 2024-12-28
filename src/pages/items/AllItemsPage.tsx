import { SearchIcon } from "@chakra-ui/icons";
import {
	VStack,
	Stack,
	Container,
	Skeleton,
	Alert,
	AlertIcon,
	Select,
	CloseButton,
	InputGroup,
	InputLeftAddon,
	Input,
	InputRightElement,
	Spinner,
	Center,
	ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Modal, useDisclosure
} from "@chakra-ui/react";
import { ItemDisplay } from "../../components/item/ItemDisplay";
import { ErrorAlertWithNavigation } from "../../components/ui/ErrorAlertWithNavigation";
import { StackedSkeleton } from "../../components/ui/StackedSkeleton";
import { useGetSourcesQuery, useItemsPrefetch, useSearchItemsQuery } from "../../services/item"
import { useGetLabelsQuery } from "../../services/label";
import React, { useEffect, useState } from "react";
import { LabelStub } from "../../models/label/LabelStub";
import { Label } from "../../models/label/Label";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { PaginatedPageControls } from "../../components/form/controls/PaginatedPageControls";
import {LabelType} from "../../models/label/LabelType";
import {useAppSelector} from "../../hooks/redux";
import {roleSelector} from "../../store/auth/auth-slice";
import {Role} from "../../utils/jwt-utils";
import {Item} from "../../models/item/Item";
import {AddItemForm} from "../../components/form/item/AddItemForm";
import {hasRole} from "../../utils/role-utils";

export const AllItemsPage = () => {
	const pageSize = 10;
	const prefetchPaginatedItems = useItemsPrefetch("searchItems")
	const [nextAt, setNextAt] = useState<number | undefined>(undefined);
	const [isTyping, setIsTyping] = useState(false);
	const [rawQuery, setRawQuery] = useState("");
	const [query, setQuery] = useState<string | undefined>(undefined);
	const [labelFilter, setLabelFilter] = useState<LabelStub | undefined>(undefined);
	const { data: page, error: pageError, status: pageStatus } = useSearchItemsQuery({ limit: pageSize, nextAt: nextAt, label: labelFilter, query: query });
	const { data: loadedLabels, error: labelsError } = useGetLabelsQuery({ labelType: LabelType.ITEM });
	const { data: manualSources } = useGetSourcesQuery()
	const roles = useAppSelector(roleSelector);

	const [currentItem, setCurrentItem] = useState<Item | undefined>(undefined)
	const {isOpen, onOpen, onClose} = useDisclosure()

	const prefetchNextPage = () => {
		if(!!page?.nextAt) {
			prefetchPaginatedItems({ limit: pageSize, nextAt: page.nextAt, label: labelFilter, query: query }, { ifOlderThan: 3600 });
		}
	}

	const nextPage = () => {
		if(!!page?.nextAt) {
			setNextAt(page.nextAt);
		}
	}

	const previousPage = () => {
		if(!!nextAt && nextAt > pageSize) {
			setNextAt(nextAt - pageSize);
		} else {
			setNextAt(undefined);
		}
	}

	const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onLabelChange(loadedLabels?.find(it => it.id === event.target.selectedOptions[0]?.id))
	}

	const onLabelChange = (label?: Label) => {
		console.log(`changing label ${label}`)
		const newValue = !!label ? { id: label.id, name: label.name } : undefined;
		setLabelFilter(newValue);
		setNextAt(undefined);
	}

	const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(e.target.value.trim().length > 0) {
			setRawQuery(e.target.value.trim());
		} else {
			setRawQuery("");
		}
	}

	useEffect(() => {
		setIsTyping(true);
		const timeoutId = setTimeout(() => {
			setNextAt(undefined);
			if(rawQuery.length >= 2) {
				setQuery(rawQuery);
			} else if (rawQuery.length === 0) {
				setQuery(undefined);
			}
			setIsTyping(false);
		}, 300);

		return () => clearTimeout(timeoutId)
	}, [rawQuery, setQuery, setIsTyping])

	return (<>
		<ErrorAlertWithNavigation show={!!pageError} navigateTo="/user" />
		{!page && <StackedSkeleton quantity={5} height="5vh"/>}
		{!!page && <VStack alignItems="left">
			<Stack direction={{base: "column", sm: "row"}}>
				{!loadedLabels && !labelsError && <Container minWidth="10vw"><Skeleton height="4vh"/></Container>}
				{!!labelsError && <Alert status="error" height="4.5vh"><AlertIcon />Cannot load labels</Alert>}
				{!!loadedLabels && !labelFilter && <Select placeholder="Filter by label" id="label-placeholder" onChange={onSelectChange}>
					{[...loadedLabels].sort((a,b) => a.name.localeCompare(b.name)).map(it => <option key={it.id} id={it.id}>{it.name}</option>)}
				</Select>}
				{!!loadedLabels && !!labelFilter && <Alert status="success" height="4.5vh"><CloseButton
					position='relative'
					left={-2}
					onClick={() => {onLabelChange(undefined)}}
				/>{loadedLabels.find(it => it.id === labelFilter.id)?.name}</Alert>}
				<InputGroup>
					<InputLeftAddon><SearchIcon /></InputLeftAddon>
					<Input id="item-search-bar" placeholder="Search" minWidth="75vw" onChange={onChangeFilter}/>
					{isTyping && <InputRightElement><Spinner /></InputRightElement>}
				</InputGroup>
            </Stack>
			{pageStatus === QueryStatus.fulfilled && page.entities.map(it => <ItemDisplay
				key={it.name}
				item={it}
				onLabelClick={id => {onLabelChange(loadedLabels?.find(it => it.id === id))}}
				onMouseEnter={() => { setCurrentItem(it) }}
				showEditButton={hasRole(roles, Role.MANAGE_ITEMS)}
				showDeleteButton={hasRole(roles, Role.DELETE_ITEMS)}
				controlsOnEdit={onOpen}
			/>)}
			{pageStatus === QueryStatus.pending && <StackedSkeleton quantity={5} height="6vh"/> }
            <Center>
                <PaginatedPageControls
                    hasNext={!!page.nextAt}
                    currentPage={!!page.nextAt ? Math.ceil(page.nextAt / pageSize) : 1}
                    increasePage={nextPage}
                    decreasePage={previousPage}
                    onNextEnter={prefetchNextPage}
                />
            </Center>
        </VStack>}
		{!!loadedLabels && !!manualSources && <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody paddingBottom="1em">
                    <AddItemForm initialState={currentItem} itemLabels={loadedLabels} manualSources={manualSources} />
                </ModalBody>
            </ModalContent>
        </Modal>}
	</>)
}