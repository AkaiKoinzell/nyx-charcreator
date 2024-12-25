import { Character } from "../../models/character/Character";
import { Alert, AlertIcon, AlertTitle, Avatar, AvatarBadge, Button, FormControl, FormErrorMessage, HStack, Heading, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SkeletonCircle, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { useGetCharacterTokenQuery, useUpdateCharacterTokenMutation } from "../../services/character";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { GiPunch } from "react-icons/gi";
import { FaHatWizard } from "react-icons/fa6";
import { LuSwords } from "react-icons/lu";
import { GiCloakDagger, GiMagicAxe, GiMagicSwirl } from "react-icons/gi";
import { FormValue } from "../../models/form/FormValue";

export const CharacterInfo = ({ character }: { character: Character<string> }) => {
	return <>
		<HStack>
			<UploadableAvatar character={character} defaultIcon={randomCharacterIcon()}/>
			<VStack>
				<Heading size="lg">{character.name}</Heading>
				<Text>{`${character.characterClass?.join("/") ?? "??"} ${character.race}`}</Text>
			</VStack>
		</HStack>
	</>
}

const UploadableAvatar = ({ character, defaultIcon }: { character: Character<string>, defaultIcon: JSX.Element }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [showBadge, setShowBadge] = useState(false)
	const { data: token, status: tokenStatus } = useGetCharacterTokenQuery(character.id)
	return <>
		{tokenStatus === QueryStatus.pending && <SkeletonCircle size='20' />}
		<Avatar
			size='xl'
			bg='teal.300'
			onMouseEnter={() => setShowBadge(true)}
			onMouseLeave={() => setShowBadge(false)}
			icon={!token ? defaultIcon : undefined}
			src={!!token ? `data:${token.mimeType};base64,${token.image}`: undefined}
		>
			{(showBadge || isOpen) && <UploadBadge character={character} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>}
		</Avatar>
	</>
}

interface UploadBadgeProps {
	character: Character<String>;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const UploadBadge = ({ character, isOpen, onOpen, onClose }: UploadBadgeProps) => {
	const [updateToken, { status, error }] = useUpdateCharacterTokenMutation()
	const [tokenFile, setTokenFile] = useState<FormValue<File>>({ value: undefined, isValid: true})

	const typeIsValid = (type: string) => {
		return (type === "image/png" || type === "image/jpeg" || type === "image/webp");
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = !!event.target.files ? event.target.files[0] : undefined;
		if (selectedFile) {
			if (selectedFile.size > 256 * 1024 || !typeIsValid(selectedFile.type)) {
				setTokenFile({ value: undefined, isValid: false});
			} else {
				setTokenFile({ value: selectedFile, isValid: true});
			}
		}
	};

	useEffect(() => {
		if(status === QueryStatus.fulfilled) {
			onClose();
		}
	}, [status, onClose])

	return <>
		<AvatarBadge boxSize='1.25em' bg='gray.300' onClick={onOpen}><Icon as={MdEdit} boxSize="0.6em" _hover={{ cursor: "pointer"}} /></AvatarBadge>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Upload a Character Token</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Alert status='info' marginBottom="1em" borderRadius="md">
						<AlertIcon />
						You can create a token using
						<Text as="span" fontWeight="bold" marginLeft="1ex"><a href="https://rolladvantage.com/tokenstamp/" target="_blank" rel="noopener noreferrer">this utility</a></Text>.
					</Alert>
					<FormControl isInvalid={!tokenFile.isValid}>
						<Input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							p={1}
						/>
						<FormErrorMessage>
							Only .png, .jpg, and .webp under 256Kb are allowed.
						</FormErrorMessage>
						{tokenFile.isValid && <Text mt={2}>File ready to upload: {tokenFile.value?.name}</Text>}
					</FormControl>
					{!!error &&
                        <Alert status='error' marginBottom="1em" borderRadius="md">
                            <AlertIcon />
                            <AlertTitle>Something went wrong:</AlertTitle>
                            <Text as="span">{JSON.stringify(error)}</Text>.
                        </Alert>
					}
				</ModalBody>

				<ModalFooter>
					<Button
						isLoading={status === QueryStatus.pending}
						colorScheme="blue"
						mr={3}
						isDisabled={!tokenFile.isValid || !tokenFile.value}
						onClick={() => { updateToken({characterId: character.id, token: tokenFile.value!});}}
					>Upload</Button>
					<Button colorScheme='gray' onClick={onClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>
}

const fallbackIcons: JSX.Element[] = [
	<GiPunch fontSize="2em"/>,
	<FaHatWizard fontSize="1.6em"/>,
	<LuSwords fontSize="1.8em"/>,
	<GiCloakDagger fontSize="2em"/>,
	<GiMagicAxe fontSize="2.5em"/>,
	<GiMagicSwirl fontSize="2em"/>
]

function randomCharacterIcon(): JSX.Element {
	return fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];
}