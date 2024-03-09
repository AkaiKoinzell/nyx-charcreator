// region characters

export const CharactersTagType = 'Character'
export const AllCharactersTag = { type: 'Character' as const, id: "All" }
export const CurrentCharactersTag = { type: 'Character' as const, id: "Current" }
export const TokenTagType = 'Token'

// endregion

// region items

export const ItemsTagType = 'Item'
export const MaterialsTagType = 'Material'
export const AllItemsTag = { type: 'Item' as const, id: "All" }

// endregion

// region sessions

export const SessionsTagType = 'Session'
export const AllSessionsTag = { type: 'Session' as const, id: "All" }
export const SessionsCountTag = { type: 'Session' as const, id: "Count" }

// endregion