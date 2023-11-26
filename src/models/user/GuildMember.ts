export interface GuildMember {
    id: string;
    username: string;
    avatar?: string
    roles: string[],
    pending: Boolean
}