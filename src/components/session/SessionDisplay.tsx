import { Avatar, AvatarBadge, Button, Card, CardBody, CardFooter, CardHeader, Divider, HStack, Heading, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Tag, TagLabel, Text, VStack, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { Player } from "../../models/player/Player"
import { Session } from "../../models/session/Session"
import { formatDate } from "../../utils/string-utils";
import { CharacterUpdate } from "../../models/session/CharacterUpdate";
import { LuSwords } from "react-icons/lu";
import { FaSkull } from "react-icons/fa6";
import { Role } from "../../utils/jwt-utils";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDeleteSessionMutation } from "../../services/session";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { ErrorAlertWithNavigation } from "../ui/ErrorAlertWithNavigation";
import { LoadingModal } from "../ui/LoadingModal";
import { SuccessAlertWithNavigation } from "../ui/SuccessAlertWithNaviagion";
import { useGetCharacterTokenQuery } from "../../services/character";
import {hasRole} from "../../utils/role-utils";

interface SessionDisplayProps {
	session: Session<Player>;
	roles: Role[];
}

interface DeleteSessionModalProps {
	session: Session<Player>;
	isOpen: boolean;
	onClose: () => void;
}

type Breakpoints = {
	flex?: string,
	stackDirection: "column" | "row"
}

export const SessionDisplay = ({ session, roles }: SessionDisplayProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const responsiveProps = useBreakpointValue<Breakpoints>({
		md: { stackDirection: "row" },
		sm: { flex: "1", stackDirection: "column" },
		base: { stackDirection: "row" }
	}, {
		fallback: "md"
	})

	return <><Card width="90vw">
		<CardHeader paddingBottom="0.5em">
			<HStack>
				<Heading size='md'>{session.title}</Heading>
				<HStack flex={responsiveProps?.flex} justifyContent="flex-end">
					<Text size='sm'>by</Text>
					<Heading size='sm'>{session.master.split(':')[1]}</Heading>
				</HStack>
			</HStack>
			{!!session.labels &&
                <HStack marginTop="0.5em">
					{session.labels.map(it => <Tag size="md" key={it.id} borderRadius="full" variant="solid" colorScheme="green"><TagLabel>{it.name}</TagLabel></Tag>)}
                </HStack>
			}
		</CardHeader>
		<Divider width="98%" marginLeft="1%" color="gray.300" />
		<CardBody paddingBottom="0.5em">
			<HStack marginBottom="1em"><Text as='b'>Registered on:</Text> <Text>{formatDate(session.date)}</Text></HStack>
			<SimpleGrid columns={{ sm: 3, md: 6 }}>
				{session.characters.map(it => <ParticipantDisplay key={it.character} character={it} />)}
			</SimpleGrid>
		</CardBody>
		{hasRole(roles, Role.MANAGE_SESSIONS) && <CardFooter justifyContent="flex-end" paddingTop="0px">
			<Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={onOpen} variant="outline">Delete</Button>
		</CardFooter>
		}
	</Card>
		<DeleteSessionModal session={session} isOpen={isOpen} onClose={onClose} />
	</>
}

const ParticipantDisplay = ({ character }: { character: CharacterUpdate }) => {
	const { data: token } = useGetCharacterTokenQuery(character.character)
	return <Stat>
		<StatLabel>
			{!token && !character.isAlive && <Avatar size='sm' bg='red.300' icon={<Icon as={FaSkull} fontSize='1.3rem' />} />}
			{!!token && !character.isAlive && <Avatar
                size='sm'
                bg='red.300'
                src={`data:${token.mimeType};base64,${token.image}`}
            ><AvatarBadge boxSize='1.25em' bg='red.300' /></Avatar>}
			{character.isAlive && <Avatar
                size='sm'
                bg='teal.300'
                icon={!token ? <Icon as={LuSwords} fontSize='1.3rem' /> : undefined}
                src={!!token ? `data:${token.mimeType};base64,${token.image}`: undefined}
            />}
		</StatLabel>
		<StatNumber>{character.ms} exp</StatNumber>
		<StatHelpText>{character.character.split(':')[1]}</StatHelpText>
	</Stat>
}

const DeleteSessionModal = ({ session, isOpen, onClose }: DeleteSessionModalProps) => {
	const [deleteSession, { status, error }] = useDeleteSessionMutation();
	return <>
		<LoadingModal
			show={status === QueryStatus.pending}
			title="Deleting session..."
		/>
		<ErrorAlertWithNavigation
			show={status === QueryStatus.rejected}
			description={JSON.stringify(error)}
		/>
		<SuccessAlertWithNavigation
			show={status === QueryStatus.fulfilled}
			navigateTo={`/session/list`}
		/>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete session</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack>
						<Text>
							Do you want to delete the session <Text as="span" fontWeight="bold">{session.title}</Text>?.
							This will also undo the exp assigned, but will not undo other effects, like items assignment.
						</Text>
						<Text fontWeight="bold">Warning: This operation cannot be undone.</Text>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="red" leftIcon={<DeleteIcon />} mr={3} onClick={() => {
						deleteSession(session.id);
						onClose();
					}}>I understand, delete
					</Button>
					<Button colorScheme='gray' onClick={onClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>
}