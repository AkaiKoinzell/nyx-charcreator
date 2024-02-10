import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import { Character } from "../../models/character/Character";
import {CharacterInventory} from "./CharacterInventory";
import {CharacterInfo} from "./CharacterInfo";

interface CharacterProps {
    character: Character<string>
}

export const CharacterDisplay = ({ character }: CharacterProps) => {
    return <Tabs>
        <TabList>
            <Tab>Info</Tab>
            <Tab>Inventory</Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                <CharacterInfo character={character} />
            </TabPanel>
            <TabPanel>
                <CharacterInventory character={character} />
            </TabPanel>
        </TabPanels>
    </Tabs>
}