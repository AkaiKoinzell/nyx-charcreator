import {Character} from "../models/character/Character";

export function playersToCharacters(characters: Character<string>[]): {[key: string]: Character<string>[]} {
	const ptc: {[key: string]: Character<string>[]}= {}
	for (const character of characters) {
		if (ptc[character.player] != null) {
			ptc[character.player].push(character)
		} else {
			ptc[character.player] = [character]
		}
	}
	return ptc
}