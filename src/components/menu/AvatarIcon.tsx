import { Avatar, SkeletonCircle } from "@chakra-ui/react";
import { GuildMember } from "../../models/user/GuildMember";
import { useNavigate } from "react-router-dom";

export const AvatarIcon = ({ user }: { user?: GuildMember }) => {
    const navigate = useNavigate();
    const avatarUrl = !!user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : undefined;

    return (
        <>
            {!!user && (
                <Avatar
                    size="sm"
                    name={user.username}
                    src={avatarUrl}
                    _hover={{ cursor: "pointer"}}
                    onClick={() => {
                        navigate("/user");
                    }}
                />
            )}
            {!user && <SkeletonCircle size="9" />}
        </>
    );
};
