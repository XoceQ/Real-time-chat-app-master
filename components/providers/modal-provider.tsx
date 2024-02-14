"use client";

import {CreateServerModal} from "@/components/modals/create-server-modal";
import React, {useEffect} from "react";
import {InviteModal} from "@/components/modals/invite-modal";
import {EditServerModal} from "@/components/modals/edit-server-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
        </>
    );
}
