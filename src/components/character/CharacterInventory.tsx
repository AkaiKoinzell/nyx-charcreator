import {Character} from "../../models/character/Character";
import {useGetItemsByIdsQuery} from "../../services/item";
import {ErrorAlertWithNavigation} from "../ui/ErrorAlertWithNavigation";
import React from "react";
import {ItemsListPage} from "../item/ItemsListPage";

export const CharacterInventory = ({ character }: { character: Character<string>}) => {
    const { data: items, error: itemsError } =
        useGetItemsByIdsQuery(Object.keys(character.inventory))

    return (<>
        <ErrorAlertWithNavigation
            show={!!itemsError}
            navigateTo="/user"
        />
        <ItemsListPage items={!!items ? [...items] : undefined} owned={character.inventory} character={character} />
    </>)
}