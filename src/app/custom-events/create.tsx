import React from "react";
import AdminLayout from "@components/layout/adminLayout";
import CreateCustomEvents from "@views/events/CreateEvent";

const CreateAdminEvents = () => {
    return (
        <AdminLayout>
            <CreateCustomEvents />
        </AdminLayout>
    );
};

export default CreateAdminEvents;
