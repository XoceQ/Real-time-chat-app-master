import {currentUser, redirectToSignIn} from "@clerk/nextjs";

import {db} from "@/lib/db";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const profile = await (db.profile as any).findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) {
        return profile;
    }


    return db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });

};