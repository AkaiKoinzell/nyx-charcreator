import {Session} from "../models/session/Session";
import {SessionStats} from "../models/session/SessionStats";

export function extractStats(sessions: Session<string>[]): SessionStats {
	const tags: { [key: string]: number } = {};
	const masters: { [key: string]: number } = {};
	for (const session of sessions) {
		const master = session.master.split(":")[0]
		if (masters[master] != null) {
			masters[master] = masters[master] + 1
		} else {
			masters[master] = 1
		}
		const labels = session.labels ?? []
		for (const tag of labels) {
			if (tags[tag.name] != null) {
				tags[tag.name] = tags[tag.name] + 1
			} else {
				tags[tag.name] = 1
			}
		}
	}
	return { tags, masters }
}