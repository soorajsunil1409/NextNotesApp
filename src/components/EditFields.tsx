"use client";

import { useMemo } from "react";

const EditFields = ({
    editedTitle,
    setEditedTitle,
    editedDesc,
    setEditedDesc,
}: {
    editedTitle: string;
    setEditedTitle: (editedTitle: string) => void;
    editedDesc: string;
    setEditedDesc: (editedDesc: string) => void;
}) => {
    const mainTitle = useMemo(() => {
        return editedTitle;
    }, []);

    const mainDesc = useMemo(() => {
        return editedDesc;
    }, []);

    return (
        <div className="flex flex-grow flex-col h-max">
            <input
                className="text-lg font-medium text-primary mb-2 line-clamp-1 bg-transparent outline-none"
                type="text"
                placeholder={mainTitle}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
                className="text-primary/70 overflow-y-auto bg-transparent text-sm outline-none h-max flex-1"
                placeholder={mainDesc}
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
            />
        </div>
    );
};

export default EditFields;
